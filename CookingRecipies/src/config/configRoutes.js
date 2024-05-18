const { homeRouter } = require("../controllers/home");
const { catalogRouter } = require("../controllers/catalog");
const { userRouter } = require("../controllers/user");
const { recipeRouter } = require("../controllers/recipe");

function configRoutes(app) {
    app.use(homeRouter);
    app.use(catalogRouter);
    app.use(userRouter);
    app.use(recipeRouter);

    app.get('*', (req, res) => {
        res.render('404');
    });
}

module.exports = { configRoutes }; 