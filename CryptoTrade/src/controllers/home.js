const { Router } = require("express");

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = { homeRouter };