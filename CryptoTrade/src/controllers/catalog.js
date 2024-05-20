const { Router } = require("express");
const { getAll, getById, search} = require('../services/crypto');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const cryptos = await getAll();
    res.render('catalog', { cryptos });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const crypto = await getById(id);
    
      if (!crypto) {
        return res.redirect('/404');
      }

      const hasUser = req.user !== undefined;
      const userId = hasUser ? req.user._id : null;
      const isAuthor = hasUser && crypto.author && userId.toString() === crypto.author.toString();
      const hasBought = hasUser && crypto.buyingList.some(buy => buy._id.toString() === userId.toString());
           
      res.render("details", { crypto, isAuthor, hasBought, hasUser });
  } catch (err) {
      console.error('Error retrieving crypto:', err);
      res.status(500).send('Error retrieving crypto');
  }
});


catalogRouter.get('/search', async (req, res) => {
  try {
      const cryptos = await getAll();
      res.render('search', { cryptos, noResults: false });
  } catch (err) {
      console.error(err);
      res.redirect('/search');
  }
});

catalogRouter.post('/search', async (req, res) => {
  try {
      const { name, paymentMethod } = req.body;
      let searchCriteria = {};

      if (name) {
          searchCriteria.name = { $regex: name, $options: 'i' }; 
      }

      if (paymentMethod) {
          searchCriteria.paymentMethod = paymentMethod;
      }

      const cryptos = await search(searchCriteria);

      res.render('search', { cryptos, noResults: cryptos.length === 0 });

  } catch (err) {
      console.error(err);
      res.redirect('/search');
  }
});

module.exports = {
    catalogRouter
};