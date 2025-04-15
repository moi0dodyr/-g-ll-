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
});
