//jshint esverion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//database
//connect
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
//schema
const articleSchema = {
  title: String,
  content: String,
};
//model
//mongoose will automatically change the Article inside parenthesis to articles i.e collction name
const Article = mongoose.model("Article", articleSchema);

////////////////////request targetting all the articles///////////////////////////////////////
//chained route handlers using express
//app.route
app
  .route("/articles")

  .get(async function (req, res) {
    try {
      const foundArticles = await Article.find({});
      //console.log(foundArticles);
      res.send(foundArticles);
    } catch (err) {
      console.log(err);
    }
  })

  .post(async function (req, res) {
    try {
      const title = await req.body.title;
      const content = await req.body.content;
      // console.log(title);
      // console.log(content);
      const newArticle = new Article({
        title: title,
        content: content,
      });

      newArticle.save();
      res.send("successfully added a new article");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  })

  .delete(async function (req, res) {
    try {
      const deletedArticles = await Article.deleteMany({});
      res.send("successfully deleted all articles");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });

////////////////////request targetting specific article///////////////////////////////////////
app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    try {
      const foundArticle = await Article.findOne({
        title: req.params.articleTitle,
      });
      res.send(foundArticle);
    } catch (err) {
      console.log(err);
      res.send("no article of that name was found");
    }
  })
  .put(async function (req, res) {
    try {
      const foundArticle = await Article.replaceOne(
        {
          title: req.params.articleTitle,
        },
        {
          title: req.body.title,
          content: req.body.content,
        }
        // {
        //   overwrite: true,
        // }
      );
      res.send("successfully updated the article");
    } catch (err) {
      console.log(err);
    }
  })
  .patch(async function (req, res) {
    try {
      const foundArticle = await Article.updateOne(
        {
          title: req.params.articleTitle,
        },
        {
          $set: req.body,
        }
      );
      res.send("Successfully patched");
    } catch (err) {
      console.log(err);
    }
  })
  .delete(async function (req, res) {
    try {
      const foundArticle = await Article.deleteOne({
        title: req.params.articleTitle,
      });
      res.send("successfully deleted");
    } catch (err) {
      console.log(err);
    }
  });

app.listen(3000, function () {
  console.log("server started on port 3000");
});
