const { Router } = require("express");
const { getById, create, update, deleteById, addWishes } = require("../services/book");
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parserError } = require("../util");
const { isValidObjectId } = require("mongoose"); 

const bookRouter = Router();

bookRouter.get("/create", isUser(), async (req, res) => {
    res.render("create");
});

bookRouter.post("/create",
    body("title").trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters long!'),
    body("author").trim().isLength({ min: 5 }).withMessage('Author must be at least 5 characters long!'),
    body("genre").trim().isLength({ min: 3 }).withMessage('Genre must be at least 3 characters long!'),
    body("stars").trim().isLength({ min: 1, max: 5 }).withMessage('Stars must be a positive number between 1 and 5!'),
    body("bookReview").trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters long!'),
    body("image").trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image should start with http:// or https://!'),
    async (req, res) => {
      const userId = req.user._id;
  
      try {
        const validation = validationResult(req);
  
        if (validation.errors.length) {
          throw validation.errors;
        }
  
        const result = await create(req.body, userId);
  
        res.redirect("/catalog");
      } catch (err) {
        res.render("create", { data: req.body, errors: parserError(err).errors });
      }
    }
);

bookRouter.get("/edit/:id", isUser(), async (req, res) => {
    const id = req.params.id;
  
    if (!isValidObjectId(id)) {
      return res.status(400).send('Invalid ObjectId');
    }
  
    try {
      const book = await getById(id);
      if (!book) {
        return res.status(404).send('Book not found');
      }
      res.render("edit", { book });
    } catch (err) {
      res.status(500).send('Error retrieving book');
    }
});
  
bookRouter.post("/edit/:id", isUser(), async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
  
    if (!isValidObjectId(id)) {
      return res.status(400).send('Invalid ObjectId');
    }
  
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        throw errors.array();
      }
  
      await update(id, req.body, userId);
  
      res.redirect(`/catalog/${id}`);
    } catch (err) {
      const errorsArray = Array.isArray(err) ? err : [err];
      res.render("edit", { recipe: req.body, errors: parserError(errorsArray).errors });
    }
});
  
bookRouter.get("/delete/:id", isUser(), async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
  
    try {
      await deleteById(id, userId);
      res.redirect("/catalog");
    } catch (err) {
      res.status(500).send("Error on delete");
    }
});  


bookRouter.get("/wish/:id", isUser(), async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user._id;

    if (!isValidObjectId(bookId)) {
      console.log("Invalid ObjectId");
      return res.status(400).send('Invalid ObjectId');
    }
  
    try {
      await addWishes(bookId, userId);
      
      res.redirect(`/catalog/${bookId}`);
  
  } catch (err) {
      console.error(err.message);
        res.status(400).render('details', { errors: [{ msg: err.message }] });
  }
  });


module.exports = {
    bookRouter
}