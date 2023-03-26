//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

app.use(express.static("public"));

//TODO
app.get("/", async function (req, res) {
  try {
    res.render("home");
  } catch (err) {
    console.log(err);
  }
});
app.get("/login", async function (req, res) {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
});
app.get("/register", async function (req, res) {
  try {
    res.render("register");
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
