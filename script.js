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
        showMedia(item);
    });
});

function showMedia(item) {
    overlay.classList.add('active');
    overlayContent.innerHTML = '';
    if (item.tagName === 'IMG') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        overlayContent.appendChild(img);
    } else {
        const video = document.createElement('video');
        video.controls = true;
        const source = document.createElement('source');
        source.src = item.querySelector('source').src;
        source.type = 'video/mp4';
        video.appendChild(source);
        overlayContent.appendChild(video);
    }
    updateArrows();
}

prevArrow.addEventListener('click', () => changeMedia(-1));
nextArrow.addEventListener('click', () => changeMedia(1));

function changeMedia(direction) {
    const gallery = document.querySelector(`.gallery.${currentType}`);
    const items = Array.from(gallery.children);
    currentIndex = (currentIndex + direction + items.length) % items.length;
    showMedia(items[currentIndex]);
}

function updateArrows() {
    const gallery = document.querySelector(`.gallery.${currentType}`);
    const items = Array.from(gallery.children);
    prevArrow.style.display = currentIndex > 0 ? 'block' : 'none';
    nextArrow.style.display = currentIndex < items.length - 1 ? 'block' : 'none';
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

// Mensaje de consola
console.log("Página cargada correctamente");