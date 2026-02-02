let mongoose = require("mongoose");

let signupSchema = new mongoose.Schema({
  userName: String,
  userEmail: {
    type: String,
    unique: true,
    required: true,
  },
  userPassword: String,
});

let Sign = mongoose.model("Sign", signupSchema);
module.exports = Sign;
