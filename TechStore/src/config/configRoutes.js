const { homeRouter } = require("../controllers/home");
const { aboutRouter } = require("../controllers/about");
const { userRouter } = require("../controllers/user");
const { catalogRouter } = require("../controllers/catalog");
const { productRouter } = require("../controllers/product");


function configRoutes(app) {
    app.use(homeRouter);
    app.use(aboutRouter);
    app.use(userRouter);
    app.use(catalogRouter);
    app.use(productRouter);


    app.get('*', (req, res) => {
        res.render('404');
    })

}

module.exports = { configRoutes };