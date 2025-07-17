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
let prevArrow, nextArrow; // Declarar variables globales para las flechas

const overlay = document.createElement('div');
overlay.className = 'overlay';
const overlayContent = document.createElement('div');
overlayContent.className = 'overlay-content';
const overlayMediaContainer = document.createElement('div');
overlayMediaContainer.className = 'overlay-media-container';
const overlayCounter = document.createElement('div');
overlayCounter.className = 'overlay-counter';

if (window.innerWidth > 768) {
    // Crear y añadir flechas solo en pantallas grandes
    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'arrow-container';
    prevArrow = document.createElement('button');
    prevArrow.id = 'prev-arrow';
    prevArrow.className = 'arrow';
    prevArrow.innerHTML = '<';
    nextArrow = document.createElement('button');
    nextArrow.id = 'next-arrow';
    nextArrow.className = 'arrow';
    nextArrow.innerHTML = '>';
    overlayContent.appendChild(prevArrow);
    overlayContent.appendChild(nextArrow);
}

overlayContent.appendChild(overlayMediaContainer);
overlayContent.appendChild(overlayCounter);
overlay.appendChild(overlayContent);
document.body.appendChild(overlay);

document.querySelectorAll('.gallery img, .gallery video').forEach(item => {
    item.addEventListener('click', () => {
        currentType = item.closest('.gallery').dataset.type;
        currentIndex = Array.from(item.parentElement.children).indexOf(item);
        showMedia(item);
    });
});

function showMedia(item) {
    overlay.classList.add('active');
    overlayMediaContainer.innerHTML = '';
    if (item.tagName === 'IMG') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        overlayMediaContainer.appendChild(img);
    } else {
        const video = document.createElement('video');
        video.controls = true;
        const source = document.createElement('source');
        source.src = item.querySelector('source').src;
        source.type = 'video/mp4';
        video.appendChild(source);
        overlayMediaContainer.appendChild(video);
    }
    const gallery = item.closest('.gallery');
    const totalItems = gallery.children.length;
    overlayCounter.textContent = `${currentIndex + 1}/${totalItems}`;
    updateArrows();
}

function updateArrows() {
    if (window.innerWidth > 768 && prevArrow && nextArrow) {
        const gallery = document.querySelector(`.gallery.${currentType}`);
        const items = Array.from(gallery.children);
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === items.length - 1;

        prevArrow.classList.toggle('hidden', isFirst);
        nextArrow.classList.toggle('hidden', isLast);
    }
}

// Asignar eventos solo si las flechas existen
if (prevArrow && nextArrow) {
    prevArrow.addEventListener('click', () => changeMedia(-1));
    nextArrow.addEventListener('click', () => changeMedia(1));
}

function changeMedia(direction) {
    const gallery = document.querySelector(`.gallery.${currentType}`);
    const items = Array.from(gallery.children);
    currentIndex = (currentIndex + direction + items.length) % items.length;
    showMedia(items[currentIndex]);
}

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
    }
});

let page = { screenshots: 0, wallpapers: 0, 'concept-arts': 0, videos: 0 };
const itemsPerPage = { screenshots: 12, wallpapers: 6, 'concept-arts': 6, videos: 6 };

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

// Toggle menú hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Mensaje de consola
console.log("Página cargada correctamente");