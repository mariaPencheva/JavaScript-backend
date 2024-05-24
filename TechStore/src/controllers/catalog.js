const { Router } = require("express");
const { getAll, getById, isPreferred } = require('../services/product');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const products = await getAll();
    res.render('catalog', { products });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
  const id = req.params.id;
  const userId = req.user ? req.user._id : null;

  try {
      const product = await getById(id);

      if (!product) {
          return res.status(404).render('404');
      }

      const hasUser = !!userId;
      const isAuthor = hasUser && product.author.toString() === userId.toString();
      const hasPref = hasUser && await isPreferred(userId, id);

      res.render('details', { product, hasUser, hasPref, isAuthor });
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).send('Error retrieving product');
  }
});

module.exports = {
    catalogRouter
};