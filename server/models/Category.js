
const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },

    store: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],  

        
  },
  {
    toJSON: {
      virtuals: true 
    }
  }
);



const Category = model('Category', categorySchema);

module.exports = Category;



 