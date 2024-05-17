const { Router } = require("express");
const { getAll, getById } = require('../services/book');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const books = await getAll();
    res.render('catalog', { books });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
    const id = req.params.id;

    const book = await getById(id);

    if (!book){
        res.status(404).render('404');
        return;  
    }

    const hasUser = req.user !== undefined;
    const isOwner = hasUser && book.owner._id.toString() === req.user._id.toString();
    const hasWished = hasUser && book.wishingList.some(wish => wish._id.toString() === req.user._id.toString());

    book.isOwner = isOwner;
    book.hasWished = hasWished;

    res.render('details', { book, hasUser, isOwner, hasWished });
});

module.exports = {
    catalogRouter
};