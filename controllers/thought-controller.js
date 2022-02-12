const { User, Thought, Reaction } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
          .select('-__v')
          .then(dbUserData => res.json(dbUserData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },

    createThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.json({ message: 'No Thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
        })
        .catch(err => {res.json(err) 
        });
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json({message: 'Reaction deleted'});
        })
        .catch(err => res.status(500).json(err));
    },
}

module.exports = thoughtController;