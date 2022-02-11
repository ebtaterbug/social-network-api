const { User, Thought, Reaction } = require('../models');

const thoughtController = {
    getAllPizza(req, res) {
        Pizza.find({})
          .populate({
            path: 'comments',
            select: '-__v'
          })
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
      },
}

module.exports = thoughtController;