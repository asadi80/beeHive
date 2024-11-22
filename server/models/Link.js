// Importing `Schema` and `model` from the mongoose library.
// `Schema` defines the structure for the documents in MongoDB.
// `model` is used to create the interface to interact with MongoDB collections.
const { Schema, model } = require('mongoose');

// Defining the schema for links to social media profiles.
const linkSchema = new Schema(
  {
    // Facebook URL field with validation
    facebook: {
      type: String,      // Data type is String, expecting the Facebook URL or handle.
      trim: true,        // Automatically trims any leading/trailing spaces.
      default: ""
      // validate: {        // Custom validator to check if the URL is valid.
      //   validator: function(v) {
      //     // Regular expression to validate the Facebook URL structure.
      //     return /^https?:\/\/(www\.)?facebook\.com\/.+$/.test(v);
      //   },
      //   // Custom error message if the validation fails.
      //   message: props => `${props.value} is not a valid Facebook URL!`
      // }
    },
    // Instagram URL field with validation
    instagram: {
      type: String,      // Data type is String, expecting the Instagram URL or handle.
      trim: true,        // Trims leading and trailing spaces.
      default: ""
      // validate: {        // Validator for the Instagram URL.
      //   validator: function(v) {
      //     // Regular expression to validate the Instagram URL structure.
      //     return /^https?:\/\/(www\.)?instagram\.com\/.+$/.test(v);
      //   },
      //   // Custom error message if the URL format is incorrect.
      //   message: props => `${props.value} is not a valid Instagram URL!`
      // }
    },
    // Twitter (formerly X) URL field with validation
    x: {
      type: String,      // Data type is String, expecting the Twitter URL or handle.
      trim: true,        // Trims any extra spaces from the URL.
      default:""
      // validate: {        // Custom validator to ensure correct URL format.
      //   validator: function(v) {
      //     // Regular expression to validate the Twitter/X URL structure.
      //     return /^https?:\/\/(www\.)?x\.com\/.+$/.test(v);
      //   },
      //   // Custom error message if the URL is invalid.
      //   message: props => `${props.value} is not a valid Twitter URL!`
      // }
    },
  },
  {
    // Enabling virtual properties (if any) to be included when converting the document to JSON.
    toJSON: {
      virtuals: true     // This allows for computed properties to be included in JSON output.
    }
  }
);

// Creating the Mongoose model for the `Link` schema.
// The model provides an interface to interact with the MongoDB collection for links.
const Link = model('Link', linkSchema);

// Exporting the `Link` model to use in other parts of the application.
module.exports = Link;
