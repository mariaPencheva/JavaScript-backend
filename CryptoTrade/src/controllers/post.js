const { Router } = require("express");
const { getById, create, update, deleteById, bought } = require('../services/crypto');
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parserError } = require("../util");

const postRouter = Router();

postRouter.get("/create", isUser(), async (req, res) => {
  res.render("create");
});

postRouter.post("/create",
  body("name").trim().isLength({ min: 2 }).withMessage('The name must be at least 2 characters long!'),
  body("price").isFloat({ min: 0 }).withMessage('The price should be a positive number!'),
  body("description").trim().isLength({ min: 10 }).withMessage('The Description should be a minimum of 10 characters long!'),
  body("paymentMethod").isIn(['crypto-wallet', 'credit-card', 'debit-card', 'paypal']).withMessage('The Payment Method must be one of the options!'),
  body("image").trim().isURL({ require_tld: false, require_protocol: true }).withMessage('The image should start with http:// or https:// !'),
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
        res.render("create", { crypto: req.body, errors: parserError(err).errors });
        }
    }
);

postRouter.get("/edit/:id", isUser(), async (req, res) => {
  const id = req.params.id;

  try {
    const crypto = await getById(id);
    if (!crypto) {
      return res.status(404).send('Crypto not found');
    }
    res.render("edit", { crypto });
  } catch (err) {
    res.status(500).send('Error retrieving crypto');
  }
});

postRouter.post("/edit/:id", isUser(), async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw errors.array();
    }

    await update(id, req.body, userId);

    res.redirect(`/catalog/${id}`);
  } catch (err) {
    const errorsArray = Array.isArray(err) ? err : [err];
    res.render("edit", { crypto: req.body, errors: parserError(errorsArray).errors });
  }
});

postRouter.get("/delete/:id", isUser(), async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    await deleteById(id, userId);
    res.redirect("/catalog");
  } catch (err) {
    res.status(500).send("Error on delete");
  }
});

postRouter.get("/buy/:id", isUser(), async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  
  try {
    const crypto = await getById(id);

    if (crypto.author._id.toString() === userId.toString()) {
      return res.status(403).send('You cannot buy your own post.');
    }

    const hasBought = crypto.buyingList.some(buyer => buyer._id.toString() === userId.toString());

    if (hasBought) {
      return res.status(400).send('You have already bought this product.');
    }

    await bought(id, userId);

    res.redirect(`/catalog/${id}`);
  } catch (err) {
    console.error("Error in buying:", err.message);
    res.status(500).send('Error in buying the product.');
  }
});

module.exports = {
    postRouter
};