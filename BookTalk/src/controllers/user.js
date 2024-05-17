const { Router } = require("express");
const { login, register } = require("../services/user");
const { createToken } = require("../services/jwt");
const { isGuest, isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parserError } = require("../util");
const { getUserWishes } = require("../services/book");

const userRouter = Router();

userRouter.get("/login", isGuest(), (req, res) => {
  res.render("login");
});

userRouter.post("/login", isGuest(),
  body("email").trim(),
  body("password").trim(),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        throw new Error("All fields are required");
      }

      const loginResult = await login(email, password);
      const token = createToken(loginResult);
      res.cookie("token", token);
      console.log("Login successful, redirecting to /profile");

      res.redirect("/");
    } catch (err) {
      console.error("Login error:", err);

      res.render("login", { data: { email }, errors: parserError(err).errors });
    }
  }
);

userRouter.get("/register", isGuest(), (req, res) => {
  res.render("register");
});

userRouter.post( "/register", isGuest(),
  body("email").trim().isLength({ min: 10 }).isEmail().withMessage("Email must be at least 10 characters long!"),
  body("username").trim().isLength({ min: 4 }).withMessage("Username must be at least 4 characters long!"),
  body("password").trim().isLength({ min: 3 }).withMessage("Password must be at least 3 characters long!"),
  body("repass").trim().custom((value, { req }) => {
      return value == req.body.password;
    })
    .withMessage("Passwords don't match!"),
  async (req, res) => {
    const { email, username, password } = req.body;

    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }

      const registerResult = await register(email, username, password);
      const token = createToken(registerResult);

      res.cookie("token", token);

      res.redirect("/");
    } catch (err) {
      res.render("register", {
        data: { email, username },
        errors: parserError(err).errors,
      });
    }
  }
);

userRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

userRouter.get("/profile", isUser(), async (req, res) => {
  const userId = req.user._id;
    const email = req.user.email;
    console.log(`Email: ${email}`);

    try {
        const wishedBooks = await getUserWishes(userId);
        res.render('profile', { email, wishedBooks });
    } catch (err) {
        res.status(500).send('Error retrieving user profile');
    }
});

module.exports = {
  userRouter
};