window.addEventListener('DOMContentLoaded', () => {
    new jsMasonry('.takePicImgGal', { percentWidth: true, callbacK: el => el.style.opacity = '' })

    Array.from(document.querySelectorAll('.takePicImgGal img')).map(x => x.addEventListener('click', e => window.open(e.target.src)))

    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
})