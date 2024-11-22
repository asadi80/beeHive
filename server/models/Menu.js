
const { Schema, model } = require('mongoose');

const menuSchema = new Schema(
  {
    category: {
      type: String,
      required: false,
      trim: true
    },
        
    meal: [
      {
        type: Schema.Types.ObjectId,
        ref: "Meal",
      },
    ],  
  },

  {
    toJSON: {
      virtuals: true
    }
  }
);



const Menu = model('Menu', menuSchema);

module.exports = Menu;



 