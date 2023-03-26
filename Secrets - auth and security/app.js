//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//level 5 cookies and session
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//level6
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

//level 4 salting
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

//level 3 hashing
// const md5 = require("md5");

//for level 2
// const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true });
//angela used the line below but in my case using it is throwing error
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose);

userSchema.plugin(findOrCreate);

//for level 2
// const secret = process.env.SECRET;
// or directly inside the line below
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
//old level
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//new
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        // Find or create user in your database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Create new user in database
          const username =
            Array.isArray(profile.emails) && profile.emails.length > 0
              ? profile.emails[0].value.split("@")[0]
              : "";
          const newUser = new User({
            username: profile.displayName,
            googleId: profile.id,
          });
          user = await newUser.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
//TODO
app.get("/", async function (req, res) {
  try {
    res.render("home");
  } catch (err) {
    console.log(err);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  }
);

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

app.get("/logout", async function (req, res) {
  req.logOut(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/secrets", async function (req, res) {
  User.find({
    secret: {
      $ne: null,
    },
  })
    .then((foundUsers) => {
      res.render("secrets", {
        usersWithSecrets: foundUsers,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app
  .route("/submit")
  .get(function (req, res) {
    if (req.isAuthenticated()) {
      res.render("submit");
    } else {
      res.rediret("/login");
    }
  })
  .post(function (req, res) {
    const submittedsecret = req.body.secret;
    User.findById(req.user.id)
      .then((foundUser) => {
        if (foundUser) {
          foundUser.secret = submittedsecret;
          foundUser
            .save()
            .then(() => {
              res.redirect("/secrets");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

app.post("/register", async function (req, res) {
  try {
    const user = await User.register(
      { username: req.body.username },
      req.body.password
    );
    passport.authenticate("local")(req, res, function () {
      res.redirect("/secrets");
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async function (req, res) {
  try {
    const user = await new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, async function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//level 4
// app.post("/register", async function (req, res) {
//   try {
//     const hash = await bcrypt.hash(req.body.password, saltRounds);
//     const newUser = await new User({
//       email: req.body.username,
//       password: hash,
//     });
//     newUser.save();
//     res.render("secrets");
//   } catch (err) {
//     console.log(err);
//   }
// });
// app.post("/login", async function (req, res) {
//   try {
//     const username = await req.body.username;
//     const password = await req.body.password;
//     const foundUser = await User.findOne({ email: username });
//     if (foundUser) {
//       const result = await bcrypt.compare(password, foundUser.password);
//       if (result === true) {
//         res.render("secrets");
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
