const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
  .connect("mongodb+srv://brooksmslaski:N6v9ee0TjsOAOiqC@cluster0.uasnjxl.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect to mongodb...", err));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


const statSchema = new mongoose.Schema({
    first: String,
    last: String,
    touchdowns: String,
    passing: String,
    recieving: String,
    rushing: String,
  });


const Stat = mongoose.model("Stats", statSchema);


app.get("/api/stats", (req, res) => {
    getStats(res);
});

const getStats = async (res) => {
    const stats = await Stat.find();
    res.send(stats);
  };

app.post("/api/stats", upload.single("img"), (req, res) => {
    const result = validateStat(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const stat = new Stat({
        first: req.body.first,
        last: req.body.last,
        touchdowns: req.body.touchdowns,
        passing: req.body.passing,
        recieving: req.body.recieving,
        rushing: req.body.rushing
    });

       createStat(stat, res);
});

const createStat = async (stat, res) => {
    const result = await stat.save();
    res.send(stat);
  };


app.put("/api/stats/:id", upload.single("img"), (req, res) => {
    const result = validateStat(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

updateStat(req, res);
});


const updateStat = async (req, res) => {
    let fieldsToUpdate = {
        first: req.body.first,
        last: req.body.last,
        touchdowns: req.body.touchdowns,
        passing: req.body.passing,
        recieving: req.body.recieving,
        rushing: req.body.rushing,
    };

    const result = await Stat.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const stat = await Stat.findById(req.params.id);
    res.send(stat);
    };

    app.delete("/api/stats/:id", upload.single("img"), (req, res) => {
        removeStat(res, req.params.id);
    });

    const removeStat = async (res, id) => {
        const stat = await Stat.findByIdAndDelete(id);
        res.send(stat);
    };

const validateStat = (stat) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        first: Joi.allow(""),
        last: Joi.allow(""),
        passing: Joi.string().min(0).required(),
        touchdowns: Joi.number().min(0).required(),
        recieving: Joi.string().min(0).required(),
        rushing: Joi.string().min(0).required(),
    });

    return schema.validate(stat);
};
  
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});