const { Router } = require("express");
const { getAll, getById, isValidObjectId } = require('../services/creature');

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    const creatures = await getAll();
    res.render('catalog', { creatures });
});

catalogRouter.get('/catalog/:id', async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).send('Invalid ObjectId');
  }
  
  try {
    const creature = await getById(id);

    if (!creature) {
      return res.status(404).render('404');
    }

    const hasUser = req.user !== undefined;
    const isAuthor = hasUser && creature.author._id.toString() === req.user._id.toString();
    const hasVoted = hasUser && creature.votesList.some(vote => vote._id.toString() === req.user._id.toString());

    creature.isAuthor = isAuthor;
    creature.hasVoted = hasVoted;
    const votersEmails = creature.votesList.map(vote => vote.email);

    res.render("details", { creature, hasUser, votersEmails });
  } catch (err) {
    res.status(500).send('Error retrieving creature');
  }
});

module.exports = {
    catalogRouter
};