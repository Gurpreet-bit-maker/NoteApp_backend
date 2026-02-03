let express = require("express");
let app = express();
let mongoose = require("mongoose");
let cors = require("cors");
let cookieParser = require("cookie-parser");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

let Notes = require("./moduls/schema.js");
let signUp = require("./moduls/signup.js");

// let { v4: uuidv4 } = require("uuid");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected with mongoDB atlas");
  } catch (error) {
    console.log(error);
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main();
//* Route for all notes

app.post("/user/signup", async (req, res) => {
  let = { userName, userEmail, userPassword } = req.body;
  try {
    let encryptPassword = await bcrypt.hash(userPassword, 10);
    let storeSignForm = await signUp.create({
      userName: userName,
      userEmail: userEmail,
      userPassword: encryptPassword,
    });
    res.status(200).json(storeSignForm);
    // console.log(storeSignForm);
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json("already exist email");
    }
    console.log(error.errorResponse);
  }
});
//todo created new cookie
app.post("/user/login", async (req, res) => {
  console.log(req.body);
  let { email, password } = req.body;
  try {
    let passwordIsTrue = await signUp.findOne({ userEmail: email });
    if (!passwordIsTrue)
      return res.status(400).json({ message: "email not exist" });
    let dcryptPassword = await bcrypt.compare(
      password,
      passwordIsTrue.userPassword,
    );
    if (!dcryptPassword) {
      return res.status(400).json({ message: "wrong password" });
    }
    let userEmail = passwordIsTrue.userEmail;
    let token = jwt.sign({ userEmail: userEmail }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      path: "/",
      sameSite: "none",
      httpOnly: true,
    });
    res.status(200).json({ message: "password match" });
  } catch (error) {
    console.log(error);
  }
});
//todo token delete
app.get("/user/signout", (req, res) => {
  // let tokenReceived = req.cookies.token;
  res.cookie("token", "", {
    path: "/",
    expires: new Date(0),
  });

  res.json({ message: "token deleted" });
});
// token Route
let auth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    let validToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!validToken) {
      return res.status(403).json({ message: "invalid token" });
    }
    req.person = validToken;

    next();
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "login" });
  }
};

app.get("/user/read", auth, async (req, res) => {
  try {
    let allnotes = await Notes.find({ userEmail: req.person.userEmail });
    res.json(allnotes);
  } catch (error) {
    console.log(error);
  }
});

//* Route for create Note

app.post("/user/add", auth, async (req, res) => {
  let { name } = req.body;
  try {
    let frontendData = {
      name: name,
      time: new Date(),
      userEmail: req.person.userEmail,
    };
    let storeNote = await Notes.create(frontendData);
    res.json(storeNote.name);
  } catch (error) {
    console.log(error);
  }
});
//* Route for specific update

app.delete("/user/del/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let deleteNote = await Notes.findByIdAndDelete(id);
    if (!deleteNote) return res.json({ message: "not found note" });
    res.status(200).json(deleteNote);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "cant delete" });
  }
});

//* Route for delete
app.put("/user/edit/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let editData = await Notes.findByIdAndUpdate(id, { name: req.body.name });
    res.json(editData);
    console.log(editData);
  } catch (error) {
    console.log(error);
  }
});
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listining on this port ${PORT}...`);
});
