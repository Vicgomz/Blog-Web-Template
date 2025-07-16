// Función para abrir un post
function openPost(title, date, author) {
    const url = `post.html?title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}&author=${encodeURIComponent(author)}`;
    window.location.href = url;
}

// Cargar contenido del post basado en la URL
function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const date = urlParams.get('date');
    const author = urlParams.get('author');

    if (title && date && author) {
        document.getElementById('post-title').textContent = title;
        document.getElementById('post-date').textContent = date;
        document.getElementById('post-author').textContent = `Posted by ${author}`;
        // La descripción ya tiene saltos de línea en el HTML
    } else {
        document.getElementById('post-title').textContent = 'Post no encontrado';
    }
}

// Ejecutar loadPost al cargar post.html
if (window.location.pathname.includes('post.html')) {
    loadPost();
}

// Mensaje de consola
console.log("Página cargada correctamente");