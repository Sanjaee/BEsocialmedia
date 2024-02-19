const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const contohSchema = new mongoose.Schema({
  name: String,
  image_post: String,
  category: String,
  title: String,
  createdAt: { type: Date, default: Date.now },
  image_profile: String,
});

const Contoh = mongoose.model("Contoh", contohSchema);

app.use(cors());
app.use(express.json());

app.post("/posts", async (req, res) => {
  try {
    const data = new Contoh(req.body);
    await data.save();
    res.status(201).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api", async (req, res) => {
  try {
    const data = await Contoh.find();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/data/:id", async (req, res) => {
  const dataId = req.params.id;

  try {
    const deletedData = await Contoh.findByIdAndDelete(dataId);

    if (!deletedData) {
      return res.status(404).send({ error: "Data tidak ditemukan" });
    }

    res.send(deletedData);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/data/:id", async (req, res) => {
  const dataId = req.params.id;

  try {
    const updatedData = await Contoh.findByIdAndUpdate(dataId, req.body, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).send({ error: "Data tidak ditemukan" });
    }

    res.send(updatedData);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di  http://localhost:${port}`);
});
