const { Router } = require("express");
const { getById, create, update, deleteById, preferProduct } = require('../services/product');
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parserError } = require("../util");

const productRouter = Router();

productRouter.get("/create", isUser(), async (req, res) => {
  res.render("create");
});

productRouter.post("/create",
  body("brand").trim().isLength({ min: 2 }).withMessage('Brand must be at least 2 characters long!'),
  body("productModel").trim().isLength({ min: 5 }).withMessage('Product model must be at least 5 characters long!'),
  body("hardDisk").trim().isLength({ min: 5 }).withMessage('Hard disk must be at least 5 characters long!'),
  body("screenSize").trim().isLength({ min: 1 }).withMessage('Screen size must be at least 1 character long!'),
  body("ram").trim().isLength({ min: 2 }).withMessage('Ram must be at least 2 characters long!'),
  body("operatingSystem").trim().isLength({ min: 5, max: 20 }).withMessage('Operating system must be between 5 and 20 characters long!'),
  body("cpu").trim().isLength({ min: 10, max: 50 }).withMessage('CPU must be between 10 and 50 characters long!'),
  body("gpu").trim().isLength({ min: 10, max: 50 }).withMessage('GPU must be between 10 and 50 characters long!'),
  body("price").isFloat({ min: 1 }).withMessage('Price must be a positive number!'),
  body("color").trim().isLength({ min: 2, max: 10 }).withMessage('Color must be between 2 and 10 characters long!'),
  body("weight").trim().isLength({ min: 1 }).withMessage('Weight must be at least 1 characters long!'), 
  body("image").trim().isURL({ require_tld: false, require_protocol: true }).withMessage('Image is required!'),
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
        res.render("create", { product: req.body, errors: parserError(err).errors });
        }
    }
);

productRouter.get("/edit/:id", isUser(), async (req, res) => {
const id = req.params.id;

try {
    const product = await getById(id);
    if (!product) {
    return res.status(404).send('Product not found');
    }
    res.render("edit", { product });
} catch (err) {
    res.status(500).send('Error retrieving product');
}
});

productRouter.post("/edit/:id", isUser(), async (req, res) => {
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
    res.render("edit", { product: req.body, errors: parserError(errorsArray).errors });
}
});

productRouter.get("/delete/:id", isUser(), async (req, res) => {
const id = req.params.id;
const userId = req.user._id;

try {
    await deleteById(id, userId);
    res.redirect("/catalog");
} catch (err) {
    res.status(500).send("Error on delete");
}
});

productRouter.get("/prefer/:id", isUser(), async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  
  try {
    const product = await getById(id);

    if (!product) {
        return res.status(404).send('Product not found.');
    }

    if (product.author.toString() === userId.toString()) {
      return res.status(403).send('You cannot prefer your own product.');
  }

    const hasPref = product.preferredList.includes(userId);

    if (hasPref) {
      return res.status(400).send('You have already preferred this product.');
    }

    await preferProduct(id, userId);

    res.redirect(`/catalog/${id}`);
  } catch (err) {
    console.error("Error in prefers:", err.message);
    res.status(500).send('Error in prefers the product.');
  }
});


module.exports = {
    productRouter
  };