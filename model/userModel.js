const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    require: [true, "Please provide an email"],
    unique: [true, "This email is already in use"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid Email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "A user must have a Password"],
    minLength: [8, "The password must be at least 8 characters long"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
