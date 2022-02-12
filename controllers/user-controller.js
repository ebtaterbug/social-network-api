const { User, Thought, Reaction } = require('../models');

const UserController = {
    getAllUsers(req, res) {
        User.find({})
          .select('-__v')
          .then(dbUserData => res.json(dbUserData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },

    createUser({ body }, res) {
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
        if (!dbUserData) {
            res.json({ message: 'No user found with this id!' });
            return;
        }
        res.json(dbUserData);
        })
        .catch(err => {res.json(err) 
        });
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this friendId' })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this friendId' })
                    return;
                }
                res.json({message: 'Successfully deleted the friend'});
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    }
}

module.exports = UserController;