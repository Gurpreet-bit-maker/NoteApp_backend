let mongoose = require("mongoose");

let note = require("./moduls/schema.js");

main()
  .then(() => console.log("connection successfull."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let noteadded = new note({
  topic: "studyNote",
  msg: "i giving you this notes",
  created_at: new Date(),
});


