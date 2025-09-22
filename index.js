let express = require("express");
let app = express();
let mongoose = require("mongoose");
let cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", 
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let note = require("./moduls/schema.js");

// let { v4: uuidv4 } = require("uuid");

main()
  .then(() => console.log("connection successfull."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
//* Route for all notes

app.get("/notes", async (req, res) => {
  let allnotes = await note.find();
  console.log(allnotes);
  res.send(allnotes);
});

//* Route for create Note

app.post("/notes/add", (req, res) => {
  let { name, msg } = req.body;
  let allDataFromBackend = {
    name: name,
    msg: msg,
    created_at: new Date(),
  };
  note
    .create(allDataFromBackend)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
});
//* Route for specific update

app.patch("/notes/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let data = await note.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Note not found" });
    }
    data.topic = "Coded";
    await data.save();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

//* Route for delete
app.delete("/notes/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    let deletedData = await note.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).send("not found data");
    }

    res.send(deletedData);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("listining on this port 3000...");
});
