const { Router } = require("express");
const { getById, create, update, addRecommend, deleteById } = require("../services/recipes");
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parserError } = require("../util");
const { isValidObjectId } = require("mongoose"); 

const recipeRouter = Router();

recipeRouter.get("/create", isUser(), async (req, res) => {
  res.render("create");

});

recipeRouter.post("/create",
  body("title").trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters!'),
  body("description").trim().isLength({ min: 10, max: 100}).withMessage('Description must be at least 10 characters and no longer than 100 characters!'),
  body("ingredients").trim().isLength({ min: 10, max: 200}).withMessage('Ingredients must be at least 10 characters and no longer than 200 characters!'),
  body("instructions").trim().isLength({ min: 10 }).withMessage('Instructions must be at least 10 characters'),
  body("image").trim().isURL({ require_tld: false, require_protocol: true }),
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

recipeRouter.get("/edit/:id", isUser(), async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).send('Invalid ObjectId');
  }

  try {
    const recipe = await getById(id);
    if (!recipe) {
      return res.status(404).send('Creature not found');
    }
    res.render("edit", { recipe });
  } catch (err) {
    res.status(500).send('Error retrieving creature');
  }
});

recipeRouter.post("/edit/:id", isUser(), async (req, res) => {
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

recipeRouter.get("/delete/:id", isUser(), async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    await deleteById(id, userId);
    res.redirect("/catalog");
  } catch (err) {
    res.status(500).send("Error on delete");
  }
});


recipeRouter.get("/recommend/:id", isUser(), async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user._id;

  try {
    await addRecommend(recipeId, userId);
    
    res.redirect(`/catalog/${recipeId}`);

} catch (err) {
    res.render('details', { errors: parserError(err).errors });
}
});

module.exports = {
  recipeRouter
};
