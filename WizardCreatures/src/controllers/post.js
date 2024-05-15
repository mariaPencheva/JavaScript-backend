const { Router } = require("express");
const { getById, create, update, deleteById, getMyCreatures, isValidObjectId, voted } = require('../services/creature');
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parserError } = require("../util");

const postRouter = Router();

postRouter.get("/create", isUser(), async (req, res) => {
  res.render("create");
});

postRouter.post("/create",
  body("name").trim().isLength({ min: 2 }),
  body("species").trim().isLength({ min: 3 }),
  body("skinColor").trim().isLength({ min: 3 }),
  body("eyeColor").trim().isLength({ min: 3 }),
  body("description").trim().isLength({ min: 5, max: 500 }),
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
        res.render("create", { creature: req.body, errors: parserError(err).errors });
        }
    }
);

postRouter.get('/profile', isUser(), async (req, res) => {
  const userId = req.user._id; 
  
  try {
    const myCreatures = await getMyCreatures(userId); 
       
    res.render("profile", { creatures: myCreatures }); 
  } catch (err) {
    res.status(500).send('Error retrieving creatures');
  }
});

postRouter.get("/edit/:id", isUser(), async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).send('Invalid ObjectId');
  }

  try {
    const creature = await getById(id);
    if (!creature) {
      return res.status(404).send('Creature not found');
    }
    res.render("edit", { creature });
  } catch (err) {
    res.status(500).send('Error retrieving creature');
  }
});

postRouter.post("/edit/:id", isUser(), async (req, res) => {
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
    res.render("edit", { creature: req.body, errors: parserError(errorsArray).errors });
  }
});

postRouter.get("/delete/:id", isUser(), async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  if (!isValidObjectId(id)) {
    return res.status(400).send('Invalid ObjectId');
  }

  try {
    await deleteById(id, userId);
    res.redirect("/catalog");
  } catch (err) {
    res.status(500).send("Error on delete");
  }
});

postRouter.get("/vote/:id", isUser(), async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  if (!isValidObjectId(id)) {
    console.log("Invalid ObjectId");
    return res.status(400).send('Invalid ObjectId');
  }
  
  try {
    await voted(id, userId);
    res.redirect(`/catalog/${id}`);
  } catch (err) {
    console.error("Error in voting:", err.message);
    res.status(500).send(err.message);
  }
});

module.exports = {
  postRouter
};