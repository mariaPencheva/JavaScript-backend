const { Book } = require('../models/Book');
const { isValidObjectId } = require("mongoose"); 

async function getAll() {
    return Book.find().lean();
};

async function getById(id) {
    return Book.findById(id).lean();
};

async function create(data, ownerId) {

    const book = new Book ({
        title: data.title,
        author: data.author,
        image: data.image,
        bookReview: data.bookReview,
        genre: data.genre,
        stars: data.stars,
        owner: ownerId
    });

    await book.save();
    return book;
};

async function update(id, data, userId) {
    const book = await Book.findById(id);

    if (!book) {
        throw new ReferenceError('Book not found ' + id);
    }

    if (book.owner.toString() != userId) {
        throw new Error('Access denied!');
    }

    book.title = data.title;
    book.author = data.author;
    book.image = data.image;
    book.bookReview = data.bookReview;
    book.genre = data.genre;
    book.stars = data.stars;

    await book.save();
    return book;
}

async function deleteById(id, userId) {
    const book = await Book.findById(id);

    if (!book) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (book.owner.toString() != userId) {
        throw new Error('Access denied!');
    }

    await Book.findByIdAndDelete(id);
}

async function addWishes(booksId, userId) {
    if (!isValidObjectId(booksId)) {
        throw new Error('Invalid book ObjectId');
    }

    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user ObjectId');
    }

    const book = await Book.findById(booksId);

    if (!book) {
        throw new ReferenceError(`Book not found with id ${booksId}`);
    }

    if (book.owner.toString() === userId) {
        throw new Error('Cannot wish your own book');
    }

        if (book.wishingList.find((r) => r.toString() == userId)) {
        throw new Error('Book already wished by this user');
    }

    book.wishingList.push(userId);

    await book.save();

    return book;
}

async function getUserWishes(userId) {
    const books = await Book.find({ wishingList: userId }).lean();
    return books; 
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    addWishes,
    getUserWishes
}