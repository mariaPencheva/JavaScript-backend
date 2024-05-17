const { bookRouter } = require("../controllers/book");
const { catalogRouter } = require("../controllers/catalog");
const { homeRouter } = require("../controllers/home");
const { userRouter } = require("../controllers/user");


function configRoutes(app) {
    app.use(homeRouter);
    app.use(catalogRouter);
    app.use(userRouter);
    app.use(bookRouter);

    app.get('*', (req, res) => {
        res.render('404');
    });
}

module.exports = { configRoutes };