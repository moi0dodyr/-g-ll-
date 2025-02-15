document.addEventListener('DOMContentLoaded', () => {
    const previewImages = document.querySelectorAll('.preview-img');
    const fullscreenImg = document.getElementById('fullscreen-img');

    previewImages.forEach(img => {
        img.addEventListener('click', () => {
            fullscreenImg.src = img.dataset.full;
            fullscreenImg.classList.add('show');
        });
    });

    fullscreenImg.addEventListener('click', () => {
        fullscreenImg.classList.remove('show');
    });
});
