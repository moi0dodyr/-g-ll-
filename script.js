document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.my-grid');
    const fullscreenImg = document.getElementById('fullscreen-img');
    let imageSources = [];
    let currentIndex = gridContainer.children.length;
    const batchSize = 8;

    // Fetch image list from imageList.json
    fetch('imageList.json')
        .then(res => res.json())
        .then(list => {
            imageSources = list.map(html => {
                // Extract src from the HTML string
                const match = html.match(/src='([^']+)'/);
                return match ? match[1] : null;
            }).filter(Boolean);

            // Load initial batch if needed
            loadMoreImages();
        });

    function loadMoreImages() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < batchSize && currentIndex < imageSources.length; i++, currentIndex++) {
            const imgDiv = document.createElement('div');
            const img = document.createElement('img');
            img.className = 'preview-img';
            img.src = imageSources[currentIndex];
            img.dataset.full = imageSources[currentIndex];
            imgDiv.appendChild(img);
            fragment.appendChild(imgDiv);
        }
        gridContainer.appendChild(fragment);
        relayoutOnImageLoad();
    }

    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMoreImages();
        }
    });

    gridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('preview-img')) {
            fullscreenImg.src = event.target.dataset.full;
            fullscreenImg.classList.add('show');
        }
    });

    fullscreenImg.addEventListener('click', () => {
        fullscreenImg.classList.remove('show');
    });

    function layoutMasonry() {
        const grid = document.querySelector('.my-grid');
        const items = Array.from(grid.children);
        const columnCount = 4;
        const gap = 20;

        // Get computed paddings
        const style = window.getComputedStyle(grid);
        const paddingLeft = parseInt(style.paddingLeft, 10);
        const paddingRight = parseInt(style.paddingRight, 10);

        // Calculate usable width for columns
        const gridWidth = grid.clientWidth - paddingLeft - paddingRight;
        const colWidth = (gridWidth - gap * (columnCount - 1)) / columnCount;

        const columnHeights = Array(columnCount).fill(0);

        items.forEach(item => {
            item.style.width = colWidth + 'px';
            item.style.position = 'absolute';

            // Find the shortest column
            const minCol = columnHeights.indexOf(Math.min(...columnHeights));
            const x = paddingLeft + (colWidth + gap) * minCol;
            const y = columnHeights[minCol];

            item.style.left = x + 'px';
            item.style.top = y + 'px';

            // Update the column height
            columnHeights[minCol] += item.offsetHeight + gap;
        });

        // Set container height
        grid.style.height = Math.max(...columnHeights) + 'px';
    }

    // Call layoutMasonry after images load
    function relayoutOnImageLoad() {
        const grid = document.querySelector('.my-grid');
        const imgs = grid.querySelectorAll('img');
        let loaded = 0;
        imgs.forEach(img => {
            if (img.complete) {
                loaded++;
            } else {
                img.onload = img.onerror = () => {
                    loaded++;
                    if (loaded === imgs.length) layoutMasonry();
                };
            }
        });
        if (loaded === imgs.length) layoutMasonry();
    }

    // Call after adding images
    relayoutOnImageLoad();
    window.addEventListener('resize', layoutMasonry);
});
