const { Schema, model } = require('mongoose');

const UserSchema = new Schema
({
    pizzaName: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]    
 },
 {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
 }
);
  
// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;