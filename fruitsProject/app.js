//jshint esversion:6

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", {
  useNewUrlParser: true,
});

// creating a schema
const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
  review: String,
});

//model
const Fruit = mongoose.model("Fruit", fruitSchema);

//new fruit document
const fruit = new Fruit({
  name: "Apple",
  rating: 10,
  review: "pretty solid as a fruit",
});

//save
//commented this else it would have saved multiple times the same apple
//fruit.save();

//people collection challange

const peopleSchema = new mongoose.Schema({
  name: String,
  age: Number,

  //establishing relationship
  favouriteFruit: fruitSchema,
});

const pineapple = new Fruit({
  name: "pineapple",
  rating: 10,
  review: "john love this",
});

const melon = new Fruit({
  name: "melon",
  rating: 10,
  review: "jyotiranjan love this",
});

//melon.save();

//pineapple.save();

const People = mongoose.model("People", peopleSchema);

const people = new People({
  name: "jyotiranjan",
  age: 23,
});

const John = new People({
  name: "John",
  age: 25,
  favouriteFruit: pineapple,
});

//John.save();

//people.save();

// People.updateOne({ name: "jyotiranjan" }, { favouriteFruit: melon })
//   .then(function () {
//     console.log("Successfully saved defult items to DB");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

//adding more data at a single time

const kiwi = new Fruit({
  name: "kiwi",
  rating: 8,
  review: "the best food",
});

const orange = new Fruit({
  name: "orange",
  rating: 6,
  review: "good food",
});

const grape = new Fruit({
  name: "grape",
  rating: 7,
  review: "like the diagram of this in childhood",
});

//commented this part bcoz it will insert again again when we run app.js

// Fruit.insertMany([kiwi, orange, grape])
//   .then(function () {
//     console.log("Successfully saved defult items to DB");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

//update

// Fruit.updateMany({ name: "pple" }, { name: "peach" })
//   .then(function () {
//     console.log("Successfully saved defult items to DB");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// Fruit.deleteOne({ name: "Apple" })
//   .then(function () {
//     console.log("Successfully removed items from DB");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

// to close the connection automatically
// mongoose.connection.close();

const getFruits = async () => {
  try {
    const fruits = await Fruit.find();
    // console.log(fruits);

    //to print only fruit name
    fruits.forEach(function (fruit) {
      console.log(fruit.name);
    });
  } catch (err) {
    console.error(err);
  }
};

getFruits();
