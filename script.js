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

// Cargar medios desde carpetas
function loadMedia() {
    const sections = ['screenshots', 'wallpapers', 'concept-arts', 'videos'];
    sections.forEach(section => {
        const gallery = document.querySelector(`.gallery.${section}`);
        gallery.innerHTML = '';
        const dir = `media/${section}/`;
        let mediaFiles = [];
        try {
            // Simulación de carga de archivos (ajústalo según tu servidor)
            // En un entorno real, usa fetch o File System API
            mediaFiles = ['file1.jpg', 'file2.png', 'file3.jpeg']; // Ejemplo de nombres arbitrarios
            if (section === 'screenshots') mediaFiles = mediaFiles.concat(['file4.jpg', 'file5.png', 'file6.jpeg', 'file7.jpg', 'file8.png', 'file9.jpeg', 'file10.jpg', 'file11.png', 'file12.jpeg']);
            else if (section !== 'videos') mediaFiles = mediaFiles.slice(0, 6); // 6 por sección excepto screenshots
            if (section === 'videos') {
                mediaFiles = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4', 'video6.mp4'];
            }

            if (mediaFiles.length === 0) {
                const placeholder = document.createElement(section === 'videos' ? 'video' : 'img');
                if (section === 'videos') {
                    placeholder.controls = true;
                    const source = document.createElement('source');
                    source.src = 'images/missing-data.png'; // Placeholder para video
                    source.type = 'video/mp4';
                    placeholder.appendChild(source);
                } else {
                    placeholder.src = 'images/missing-data.png';
                }
                placeholder.alt = `No ${section} available`;
                placeholder.dataset.index = 0;
                gallery.appendChild(placeholder);
            } else {
                mediaFiles.forEach((file, index) => {
                    if (section === 'videos' || file.endsWith('.mp4')) {
                        if (section === 'videos') {
                            const video = document.createElement('video');
                            video.controls = true;
                            const source = document.createElement('source');
                            source.src = `${dir}${file}`;
                            source.type = 'video/mp4';
                            video.appendChild(source);
                            video.alt = file;
                            video.dataset.index = index;
                            gallery.appendChild(video);
                        }
                    } else {
                        const img = document.createElement('img');
                        img.src = `${dir}${file}`;
                        img.alt = file;
                        img.dataset.index = index;
                        gallery.appendChild(img);
                    }
                });
            }
        } catch (e) {
            console.error(`Error loading ${section}:`, e);
            const placeholder = document.createElement('img');
            placeholder.src = 'images/missing-data.png';
            placeholder.alt = `Error loading ${section}`;
            placeholder.dataset.index = 0;
            gallery.appendChild(placeholder);
        }
        updateGallery(section);
        updatePagination(section);
    });
}

document.querySelectorAll('.gallery img, .gallery video').forEach(item => {
    item.addEventListener('click', () => {
        currentType = item.closest('.gallery').dataset.type;
        currentIndex = parseInt(item.dataset.index);
        zoomLevel = 1; // Reset zoom
        showMedia(item);
    });
});

function showMedia(item) {
    overlay.classList.add('active');
    if (item.tagName === 'IMG') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.style.transform = `scale(${zoomLevel})`;
        overlayContent.innerHTML = '';
        overlayContent.appendChild(img);
    } else {
        const video = document.createElement('video');
        video.controls = true;
        const source = document.createElement('source');
        source.src = item.querySelector('source').src;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.style.transform = `scale(${zoomLevel})`;
        overlayContent.innerHTML = '';
        overlayContent.appendChild(video);
    }
    updateArrows();
}

prevArrow.addEventListener('click', () => changeMedia(-1));
nextArrow.addEventListener('click', () => changeMedia(1));

overlayContent.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomLevel = Math.max(1, Math.min(2, zoomLevel + (e.deltaY > 0 ? -0.1 : 0.1))); // Límite de 1x a 2x
    const media = overlayContent.querySelector('img, video');
    if (media) media.style.transform = `scale(${zoomLevel})`;
});

function changeMedia(direction) {
    const gallery = document.querySelector(`.gallery.${currentType}`);
    const items = Array.from(gallery.children).filter(item => item.style.display !== 'none');
    currentIndex = (currentIndex + direction + items.length) % items.length;
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
    loadMedia(); // Cargar medios al iniciar
    updateGallery(gallery.dataset.type);
    updatePagination(gallery.dataset.type);
});

// Mensaje de consola
console.log("Página cargada correctamente");