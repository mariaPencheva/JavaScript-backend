const { Router } = require("express");
const { login, register } = require("../services/user");
const { getMyCreatedProducts, getMyPreferredProducts } = require("../services/product");
const { createToken } = require("../services/jwt");
const { isGuest, isUser } = require("../middlewares/guards");
const { body, validationResult } = require('express-validator');
const { parserError } = require("../util");

const userRouter = Router();

userRouter.get('/register', isGuest(), (req, res) => {
    res.render('register');
});
  
userRouter.post('/register', isGuest(),
  body('name').trim().isLength({ min: 2, max: 20 }).withMessage('Name must be between 2 and 20 characters long!'),
  body('email').trim().isLength({ min: 10 }).isEmail().withMessage('Email must be at least 10 characters long!'),
  body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long!'),
  body('repass').trim().custom((value, { req }) => { return value == req.body.password }).withMessage('Passwords don\'t match!'),
  async (req, res) => {
    const { name, email, password, repass } = req.body;

    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }

      const registerResult = await register(name, email, password, repass);
      const token = createToken(registerResult);
      res.cookie('token', token);

      res.redirect("/");

    } catch (err) {
      res.render("register", { data: { name, email, password, repass }, errors: parserError(err).errors });
    }
  }
);

userRouter.get("/login", isGuest(), (req, res) => {
    res.render("login");
});
  
userRouter.post("/login", isGuest(),
    body('email').trim(),
    body('password').trim(),
    async (req, res) => {
      const { email, password } = req.body;

    try {
      const validation = validationResult(req);
      if (!validation.isEmpty()) {
          throw new Error(validation.array().map(err => err.msg).join(' '));
      }

      const loginResult = await login(email, password);
      const token = createToken(loginResult);
      res.cookie('token', token);

      res.redirect("/");
  } catch (err) {
      res.render("login", { data: { email, password }, errors: [err.message] });
  }
}
);
  


userRouter.get('/profile', isUser(), async (req, res) => {
  const userId = req.user._id; 
  
  try {
    const createdProducts = await getMyCreatedProducts(userId);
    const preferredProducts = await getMyPreferredProducts(userId);

        res.render("profile", { 
          user: req.user,
          createdProducts,
          preferredProducts,
          hasUser: !!req.user
      });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving profile');
    }
});
  
userRouter.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});


module.exports = { 
    userRouter
};