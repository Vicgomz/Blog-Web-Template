// Funciones para posts
function openPost(title, date, author) {
    const url = `post.html?title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}&author=${encodeURIComponent(author)}`;
    window.location.href = url;
}

function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const date = urlParams.get('date');
    const author = urlParams.get('author');

    if (title && date && author) {
        document.getElementById('post-title').textContent = title;
        document.getElementById('post-date').textContent = date;
        document.getElementById('post-author').textContent = `Posted by ${author}`;
        document.getElementById('post-description').textContent = "Test";
    } else {
        document.getElementById('post-title').textContent = 'Post no encontrado';
    }
}

if (window.location.pathname.includes('post.html')) {
    loadPost();
}

// Funciones para multimedia
let currentIndex = 0;
let currentType = '';
let zoomLevel = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

const overlay = document.createElement('div');
overlay.className = 'overlay';
const overlayContent = document.createElement('div');
overlayContent.className = 'overlay-content';
const prevArrow = document.createElement('button');
prevArrow.id = 'prev-arrow';
prevArrow.className = 'arrow';
prevArrow.innerHTML = '<';
const nextArrow = document.createElement('button');
nextArrow.id = 'next-arrow';
nextArrow.className = 'arrow';
nextArrow.innerHTML = '>';
overlay.appendChild(overlayContent);
overlay.appendChild(prevArrow);
overlay.appendChild(nextArrow);
document.body.appendChild(overlay);

document.querySelectorAll('.gallery img, .gallery video').forEach(item => {
    item.addEventListener('click', () => {
        currentType = item.closest('.gallery').dataset.type;
        currentIndex = Array.from(item.parentElement.children).indexOf(item);
        zoomLevel = 1; // Reset zoom
        translateX = 0; // Reset posición
        translateY = 0;
        showMedia(item);
    });
});

function showMedia(item) {
    overlay.classList.add('active');
    if (item.tagName === 'IMG') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
        overlayContent.innerHTML = '';
        overlayContent.appendChild(img);
    } else {
        const video = document.createElement('video');
        video.controls = true;
        const source = document.createElement('source');
        source.src = item.querySelector('source').src;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
        overlayContent.innerHTML = '';
        overlayContent.appendChild(video);
    }
    updateArrows();
}

prevArrow.addEventListener('click', () => changeMedia(-1));
nextArrow.addEventListener('click', () => changeMedia(1));

overlayContent.addEventListener('wheel', (e) => {
    e.preventDefault();
    const oldZoom = zoomLevel;
    zoomLevel = Math.max(1, Math.min(5, zoomLevel + (e.deltaY > 0 ? -0.1 : 0.1))); // Límite de 1x a 5x
    const media = overlayContent.querySelector('img, video');
    if (media) {
        const rect = overlayContent.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const scaleFactor = zoomLevel / oldZoom;
        translateX = (translateX + mouseX) * scaleFactor - mouseX;
        translateY = (translateY + mouseY) * scaleFactor - mouseY;
        media.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
    }
});

overlayContent.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // Click derecho
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        overlayContent.style.cursor = 'grabbing';
    }
});

overlayContent.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const media = overlayContent.querySelector('img, video');
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        if (media) media.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
    }
});

overlayContent.addEventListener('mouseup', () => {
    isDragging = false;
    overlayContent.style.cursor = 'move';
});

overlayContent.addEventListener('mouseleave', () => {
    isDragging = false;
    overlayContent.style.cursor = 'move';
});

function changeMedia(direction) {
    const gallery = document.querySelector(`.gallery.${currentType}`);
    const items = Array.from(gallery.children).filter(item => item.style.display !== 'none');
    currentIndex = (currentIndex + direction + items.length) % items.length;
    zoomLevel = 1; // Reset zoom al cambiar
    translateX = 0; // Reset posición
    translateY = 0;
    showMedia(items[currentIndex]);
}

function updateArrows() {
    const gallery = document.querySelector(`.gallery.${currentType}`);
    const items = Array.from(gallery.children).filter(item => item.style.display !== 'none');
    prevArrow.style.display = items.length > 1 ? 'block' : 'none';
    nextArrow.style.display = items.length > 1 ? 'block' : 'none';
}

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
    }
});

let page = { screenshots: 0, wallpapers: 0, 'concept-arts': 0, videos: 0 };
const itemsPerPage = { screenshots: 12, wallpapers: 9, 'concept-arts': 9, videos: 9 };

function changePage(type, direction) {
    const gallery = document.querySelector(`.gallery.${type}`);
    const maxPage = Math.floor((gallery.children.length - 1) / itemsPerPage[type]);
    page[type] = Math.max(0, Math.min(maxPage, page[type] + direction));
    updateGallery(type);
    updatePagination(type);
}

function updateGallery(type) {
    const gallery = document.querySelector(`.gallery.${type}`);
    const items = Array.from(gallery.children);
    items.forEach((item, index) => {
        item.style.display = (index >= page[type] * itemsPerPage[type] && index < (page[type] + 1) * itemsPerPage[type]) ? 'block' : 'none';
    });
}

function updatePagination(type) {
    const pagination = document.querySelector(`.pagination[data-type="${type}"]`);
    pagination.innerHTML = '';
    const gallery = document.querySelector(`.gallery.${type}`);
    const maxPage = Math.floor((gallery.children.length - 1) / itemsPerPage[type]);
    for (let i = 0; i <= maxPage; i++) {
        const span = document.createElement('span');
        span.className = i === page[type] ? 'active' : '';
        pagination.appendChild(span);
    }
    if (maxPage === 0 && gallery.children.length === 0) {
        const span = document.createElement('span');
        span.className = '';
        pagination.appendChild(span);
    }
}

document.querySelectorAll('.gallery').forEach(gallery => {
    updateGallery(gallery.dataset.type);
    updatePagination(gallery.dataset.type);
});

// Mensaje de consola
console.log("Página cargada correctamente");