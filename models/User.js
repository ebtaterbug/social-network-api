const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

const UserSchema = new Schema
({
    Username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/]
    },
    thoughts: [thoughtSchema],
    friends: [UserSchema],  
 },
 {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
 }
);
  
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;