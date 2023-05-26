const {nanoid} = require('nanoid');
const books = require('./books');

// ADD A NEW BOOK
const addNewBookHandler = (req, h) => {
    const {name, year, author, summary, publisher,
        pageCount, readPage, reading} = req.payload;

    const id = nanoid(16);
    const finished = (readPage === pageCount);

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    // Failed response: Client didn't fill the book's name
    if (!name) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);

        return res;
    }

    // Failed response: Wrong input readPage, readPage shouldn't be greater than pageCount
    if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);

        return res;
    }

    // Succeeded response: The book's detail will be added with new generated id
    books.push(newBook);
    const isSuccsess = books.filter((book) => book.id === id).length > 0;
    if (isSuccsess) {
        const res = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        }).code(201);

        return res;
    }

    // Failed response for another reason
    const res = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku.'
    }).code(500);

    return res;
};


// SHOW ALL BOOKS
const getAllBooksHandler = (req, h) => {
    const {name, reading, finished} = req.query;
    let filteredBooks;

    // Show books without filtering or searching by spesific keyword
    if (!name && !reading && !finished) {
        const res = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        }).code(200);

        return res;
    }

    // Filtering by any input keyword
    if (name) {
        filteredBooks = books.filter((book) => {
            const filterbyName = new RegExp(name, 'gi');
            return filterbyName.test(book.name);
        });
    }

    // Filtering by reading
    if (reading) {
        filteredBooks = books.filter((book) => book.reading === (reading === '1'));
    }

    // Filtering finished reading
    if (finished) {
        filteredBooks = books.filter((book) => book.finished === (finished === '1'));
    }

    // Show books by resnponse of specific filtering (reading, finished, or any keyword)
    const res = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    }).code(200);

    return res;
};


// FIND BOOKS BY SPECIFIC ID
const getBookbyIdHandler = (req, h) => {
    const {id} = req.params;

    const book = books.filter((book) => book.id === id)[0];

    // Succeeded response
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            }
        };
    }

    // Failed response: Couldn't find book
    const res = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    }).code(404);

    return res;
};


// UPDATE BOOKS BY SPECIFIC ID
const updateBookbyIdHandler = (req, h) => {
    const {bookId} = req.params;

    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading
    } = req.payload;

    const finished = (readPage === pageCount);

    const updatedAt = new Date().toISOString();

    // Failed response: Client didn't fill the book's name
    if (!name) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);

        return res;
    }

    // Failed response: Wrong input readPage, readPage shouldn't be greater than pageCount
    if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);

        return res;
    }

    // Succeeded response: The book's detail will be updated
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        };

        const res = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
            data: {
                books
            }
        }).code(200);

        return res;
    }

    // Failed response: Couldn't find book
    const res = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);

    return res;
};


// DELETE BOOKS BY SPECIFIC ID
const deleteBookbyIdHandler = (req, h) => {
    const {bookId} = req.params;

    // Succeeded response
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const res = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);

        return res;
    }

    // Failed response
    const res = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);

    return res;
};


module.exports = {
    addNewBookHandler,
    getAllBooksHandler,
    getBookbyIdHandler,
    updateBookbyIdHandler,
    deleteBookbyIdHandler
};
