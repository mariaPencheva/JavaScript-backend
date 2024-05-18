const { Router } = require("express");
const { getAll, getById, search } = require('../services/recipes');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const recipes = await getAll();
    res.render('catalog', { recipes });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
    const id = req.params.id;

    const recipe = await getById(id);

    if (!recipe){
        res.status(404).render('404');
        return; 
    }

    recipe.recommended = recipe.recommendList.length;
    const hasUser = req.user;
    const isAuthor = req.user?._id == recipe.author.toString();
    const hasRecommended = Boolean(recipe.recommendList.find(r => req.user?._id == r.toString()));
    
    res.render('details', { recipe, hasUser, isAuthor, hasRecommended });
});

catalogRouter.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        let recipes = [];

        if (query) {
            recipes = await search(query);
        } else {
            recipes = await getAll();
        }

        res.render('search', { recipes, query });

    } catch (err) {
        console.error("Error searching recipes:", err);
        res.status(404).render('404');
    }

});

module.exports = {
    catalogRouter
};