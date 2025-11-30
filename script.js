// Arreglo principal para almacenar los libros (Simula base de datos)
let library = JSON.parse(localStorage.getItem('myLibrary')) || [];

// Elementos del DOM
const bookForm = document.getElementById('book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const bookList = document.getElementById('book-list');
const emptyMsg = document.getElementById('empty-msg');
const searchBar = document.getElementById('search-bar');

// --- HU-01: REGISTRAR LIBRO ---
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newBook = {
        id: Date.now(), // Genera ID único basado en el tiempo
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        isLent: false // Estado inicial: Disponible
    };

    library.push(newBook);
    saveAndRender();
    bookForm.reset();
    titleInput.focus();
});

// --- HU-06: ELIMINAR LIBRO ---
function deleteBook(id) {
    if(confirm('¿Estás seguro de eliminar este libro?')) {
        library = library.filter(book => book.id !== id);
        saveAndRender();
    }
}

// --- HU-04 y HU-05: PRESTAR Y DEVOLVER ---
function toggleLoan(id) {
    const book = library.find(book => book.id === id);
    if (book) {
        book.isLent = !book.isLent; // Invierte el estado
        saveAndRender();
    }
}

// --- HU-02: LISTAR LIBROS (Renderizado) ---
function renderBooks(books = library) {
    bookList.innerHTML = '';
    
    if (books.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        
        books.forEach(book => {
            const row = document.createElement('tr');
            
            // Lógica de estado
            const statusText = book.isLent ? 'Prestado' : 'Disponible';
            const statusClass = book.isLent ? 'status-lent' : 'status-available';
            
            // Botón dinámico (Si está prestado muestra "Devolver", si no "Prestar")
            const actionBtn = book.isLent 
                ? `<button class="btn btn-action btn-return" onclick="toggleLoan(${book.id})" title="Devolver Libro"><i class="fas fa-undo"></i></button>`
                : `<button class="btn btn-action btn-loan" onclick="toggleLoan(${book.id})" title="Prestar Libro"><i class="fas fa-hand-holding"></i></button>`;

            row.innerHTML = `
                <td>#${book.id.toString().slice(-4)}</td>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    ${actionBtn}
                    <button class="btn btn-action btn-delete" onclick="deleteBook(${book.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
                </td>
            `;
            bookList.appendChild(row);
        });
    }
}

// --- HU-03: BUSCAR LIBRO ---
searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filteredBooks = library.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
    );
    renderBooks(filteredBooks);
});

// Función auxiliar para guardar en LocalStorage
function saveAndRender() {
    localStorage.setItem('myLibrary', JSON.stringify(library));
    renderBooks();
}

// Inicializar vista
document.addEventListener('DOMContentLoaded', () => renderBooks());