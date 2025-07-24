const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxLength: [40, "A tour name must have less or equal to 40 characters"],
      minLength: [10, "A tour name must have more or equal to 40 characters"],
      validate: [validator.isAlpha, "Tour must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty must be easy, medium or difficult",
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "A tour rating must be more or equal to 1 "],
      max: [1, "A tour rating must be less or equal to 5 "],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: String,
      required: [true, "A tour must have a price"],
    },
    priceDisount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
      message: "Discount Price ({VALUE}) should be below the regular price",
    },
    summery: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have an image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Document Middleware, Runs before .save() and .create() commands but not before .insertMany()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// Query Middleware
// tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }).select("-secretTour");
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});
// Aggregate Middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("tours", tourSchema);
module.exports = Tour;
