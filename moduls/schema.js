let mongoose = require("mongoose");

let notesSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  msg: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
  },
});

let Note = mongoose.model("Note", notesSchema);
module.exports = Note;
