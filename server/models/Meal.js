const { Schema, model } = require("mongoose");

const mealSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: false,
      trim: true,
    },

    ingredients: {
      type: String,
      required: false,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Meal = model("Meal", mealSchema);

module.exports = Meal;
