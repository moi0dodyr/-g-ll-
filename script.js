document.addEventListener('DOMContentLoaded', () => {
    const previewImages = document.querySelectorAll('.preview-img');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const gridContainer = document.querySelector('.my-grid');

    // Array of image sources
    const imageSources = Array.from({ length: 409 }, (_, i) => `src/${String(i + 1).padStart(4, '0')}.jpg`);

    // Track the current index of loaded images
    let currentIndex = previewImages.length;

    // Function to load more images
    function loadMoreImages() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 20 && currentIndex < imageSources.length; i++) {
            const imgDiv = document.createElement('div');
            const img = document.createElement('img');
            img.className = 'preview-img';
            img.src = imageSources[currentIndex];
            img.dataset.full = imageSources[currentIndex];
            imgDiv.appendChild(img);
            fragment.appendChild(imgDiv);
            currentIndex++;
        }
        gridContainer.appendChild(fragment);
    }

    // Scroll event listener
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMoreImages();
        }
    });

    // Fullscreen image logic
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
