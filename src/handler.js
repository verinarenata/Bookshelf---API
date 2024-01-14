const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  const id = nanoid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const book = {
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
    updatedAt,
  };

  books.push(book);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });

  response.code(201);

  return response;
};

const getAllBook = (request, h) => {
  const { name, reading, finished } = request.query;

  let result;

  if (name !== undefined) {
    const filteredBooks = books.filter((book) => {
      const loweredBookName = book.name.toLowerCase();
      return loweredBookName === name.toLowerCase();
    });

    result = filteredBooks;
  } else if (reading !== undefined && ['0', '1'].includes(reading)) {
    const filteredBooks = books.filter((book) => {
      if (reading === '0') {
        return book.reading === false;
      }

      return book.reading === true;
    });

    result = filteredBooks;
  } else if (finished !== undefined && ['0', '1'].includes(finished)) {
    const filteredBooks = books.filter((book) => {
      if (finished === '0') {
        return book.finished === false;
      }

      return book.finished === true;
    });

    result = filteredBooks;
  } else {
    result = books;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: result.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  return response;
};

const getBook = (request, h) => {
  const { bookId } = request.params;

  const bookFound = books.find((book) => book.id === bookId);

  if (bookFound === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: bookFound,
    },
  });

  return response;
};

const updateBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const { bookId } = request.params;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  const indexFound = books.findIndex((book) => book.id === bookId);

  if (indexFound === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);

    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  books[indexFound] = {
    ...books[indexFound],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const indexFound = books.findIndex((book) => book.id === bookId);

  if (indexFound === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);

    return response;
  }

  books.splice(indexFound, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  return response;
};

module.exports = {
  addBook,
  getAllBook,
  getBook,
  updateBook,
  deleteBook,
};
