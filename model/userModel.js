const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    select: false,
    // This only works on Create or Save
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and confirm password don't match",
    },
  },
});
userSchema.pre("save", async function (req, res, next) {
  if (!this.isModified) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
