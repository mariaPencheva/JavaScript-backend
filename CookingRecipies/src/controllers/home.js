const { Router } = require("express");
const { getLastThree } = require("../services/recipes");

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    try {
        const recipes = await getLastThree();
        res.render('home', { recipes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = { homeRouter };