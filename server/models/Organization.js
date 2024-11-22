const { Schema, model } = require("mongoose");

// Define a sub-schema for the location
const locationSchema = new Schema({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
});

// Define a sub-schema for working hours
const workingHoursSchema = new Schema({
  day: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
});

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: locationSchema, // Use location sub-schema
      required: false,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      match: /.+\@.+\..+/, // Basic email format validation
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^\+?[1-9]\d{1,14}$/, // E.164 phone number format validation
    },

    delivery: {
      type: String,
      required: false,
      trim: true,
    },

    working_hours: [workingHoursSchema], // Use working hours sub-schema

    logo: {
      type: String,
      required: false,
      trim: true,
      match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, // Validate URL for images
    },

    cover: {
      type: String,
      required: false,
      trim: true,
      match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, // Validate URL for cover images
    },

    about: {
      type: String,
      required: false,
      trim: true,
      default: "Information not provided", // Default value for about section
    },

    facebook: {
      type: String,
      trim: true,
      match: /^(https?:\/\/)?(www\.)?facebook.com\/[A-Za-z0-9_.]+\/?$/, // Facebook URL validation
    },

    instagram: {
      type: String,
      trim: true,
      match: /^(https?:\/\/)?(www\.)?instagram.com\/[A-Za-z0-9_.]+\/?$/, // Instagram URL validation
    },

    x: {
      type: String,
      trim: true,
      match: /^(https?:\/\/)?(www\.)?x.com\/[A-Za-z0-9_.]+\/?$/, // X/Twitter URL validation
    },

    color: {
      type: String,
      required: false,
      trim: true,
    },

  
    menu: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],

    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true, // Add timestamps for createdAt and updatedAt
  }
);

// Add indexes if necessary
organizationSchema.index({ name: 1, email: 1 });
organizationSchema.index({ name: "text", about: "text" }); // Text index for search

const Organization = model("Organization", organizationSchema);

module.exports = Organization;
