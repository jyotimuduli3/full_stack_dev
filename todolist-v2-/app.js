//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

//require mongoose
const mongoose = require("mongoose");

const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connect
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  UseNewUrlParser: true,
});

//schema

const itemsSchema = new mongoose.Schema({
  name: String,
});

//model

const Item = new mongoose.model("item", itemsSchema);

//3 new default items in our todolist

const item1 = new Item({
  name: "Daily challange done at gfg",
});

const item2 = new Item({
  name: "Development module target completed",
});

const item3 = new Item({
  name: "DSA 2 video done",
});

//creating an array

const defaultItems = [item1, item2, item3];

async function getItems() {
  const Items = await Item.find({});
  return Items;
}

//new schema

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = new mongoose.model("list", listSchema);

//other

app.get("/", function (req, res) {
  // var today = new Date();

  // var options = {
  //   weekday: "long",
  //   day: "numeric",
  //   year: "numeric",
  //   month: "numeric",
  // };

  // var day = today.toLocaleDateString("en-GB", options);

  getItems().then(function (foundItems) {
    if (foundItems.length === 0) {
      //inserting
      Item.insertMany(defaultItems)
        .then(function () {
          console.log("item added successfully");
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  });
});

app.post("/", async function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    newItem.save();

    //inorder to show it in list we just need to redirect
    res.redirect("/");
  } else {
    try {
      const foundList = await List.findOne({ name: listName });
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    } catch (err) {}
  }
});

app.post("/delete", async function (req, res) {
  const checkedItemid = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    try {
      const res = await Item.findByIdAndRemove(checkedItemid);
      console.log("success");
    } catch (err) {
      console.log(err);
    }
    // Item.findByIdAndRemove(checkedItemid)
    //   .then(function () {
    //     console.log("success");
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
    res.redirect("/");
  } else {
    try {
      const foundList = await List.findOneUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemid } } }
      );
      res.redirect("/" + listName);
    } catch (err) {}
  }
});

app.get("/:customListName", async function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  try {
    const foundList = await List.findOne({ name: customListName });
    //console.log(res)
    if (!foundList) {
      //create a new list
      const list = new List({
        name: customListName,
        items: defaultItems,
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      //show list
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
