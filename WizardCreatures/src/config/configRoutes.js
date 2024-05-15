const { homeRouter } = require("../controllers/home");
const { userRouter } = require("../controllers/user");
const { catalogRouter } = require('../controllers/catalog');
const { postRouter } = require('../controllers/post');

function configRoutes(app) {
    app.use(homeRouter);
    app.use(userRouter);
    app.use(catalogRouter);
    app.use(postRouter);

    app.get('*', (req, res) => {
        res.render('404');
    })
}

module.exports = { configRoutes };