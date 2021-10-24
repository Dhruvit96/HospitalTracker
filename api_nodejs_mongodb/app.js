const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
var fs = require("fs");
var dir = path.join(__dirname, "/public/images");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const url = process.env.MONGODB_URL;

const {
  adminRouter,
  cityRouter,
  dataRouter,
  doctorRouter,
  hospitalRouter,
  invitationRouter,
} = require("./routes");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });

const app = express();

app.get("/", (req, res) => res.send("works"));

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));

// Adding routes
app.use("/api/admin", adminRouter);
app.use("/api/invitation", invitationRouter);
app.use("/api/hospital", hospitalRouter);
app.use("/api/city", cityRouter);
app.use("/api/data", dataRouter);
app.use("/api/doctor", doctorRouter);

module.exports = app;
