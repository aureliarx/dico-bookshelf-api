const {
    addNewBookHandler,
    getAllBooksHandler,
    getBookbyIdHandler,
    updateBookbyIdHandler,
    deleteBookbyIdHandler
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addNewBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookbyIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookbyIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookbyIdHandler,
    }
];

module.exports = routes;
