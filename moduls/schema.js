let mongoose = require("mongoose");

let notesSchema = new mongoose.Schema({
  name: String,
  time: Date,
  userEmail: String,
});

let Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;
