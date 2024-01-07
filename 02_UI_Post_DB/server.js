const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const port = 9000;

const DBname = "userdata";
const url_db = "mongodb://127.0.0.1:27017/" + DBname;

const Schema = mongoose.Schema;
const Model = "user";

const studentSchema = new Schema(
  {
    name: String,
    email: String,
    size: String,
    date: String,
  },
  { timeseries: true, versionKey: false }
);

const student2023Model = mongoose.model(Model, studentSchema);

mongoose.connect(url_db, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("error", (err) => {
  console.log.error("MongoDB error", err);
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/student/", async (req, res) => {
  const payload = req.body;
  const student_insert = new student2023Model(payload);
  student_insert
    .save()
    .then(() => {
      console.log("User Register successfully");
    })
    .catch((err) => {
      res.send("Error");
    })
    .finally(() => {
      res.send("User Register successfully");
    });

  //   await student_insert.save();
  //   res.send("OK");
});
app.get("/student/:name/:email", async (req, res) => {
  const name_enter = req.params.name;
  const email_enter = req.params.email;
  const query = { name: { $eq: name_enter }, email: { $eq: email_enter } };

  try {
    const data = await student2023Model.find(query);
    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/student/:name/", async (req, res) => {
  const name_enter = req.params.name;
  const query = { name: { $eq: name_enter } };

  try {
    const data = await student2023Model.find(query);
    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/student/:name", async (req, res) => {
  const name_enter = req.params.name;
  const payload = req.body;


  const filter = { name: name_enter };

  student2023Model
    .findOneAndUpdate(filter, payload)
    .then(() => {
      console.log("Book successfully");
    })
    .catch((err) => {
      res.send("Error");
    })
    .finally((data) => {
      // Close the MongoDB connection
      res.send("Book successfully");
    });

  //   await student2023Model.findOneAndUpdate(filter,payload);
  //   res.send("OK");
});


app.delete("/student/:name", async (req, res) => {
  const name_enter = req.params.name;

  const filter = { name: name_enter };
  const update = { $unset: { size: "", date: "" } };

  try {
    const updatedStudent = await student2023Model.findOneAndUpdate(filter, update, { new: true });

    if (updatedStudent) {
      res.send("Reservation Cancelled");
    } else {
      res.status(404).send("Student not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// http://127.0.0.1:9000/
app.listen(port, () => {
  console.log("Server Start on port " + port);
});