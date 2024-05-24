const { Router } = require("express");

const aboutRouter = Router();

aboutRouter.get('/about', async (req, res) => {
    try {
        res.render('about');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = { aboutRouter };