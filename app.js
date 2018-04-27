const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// for connecting twitter
const UserController = require('./api/controllers/user');

//passport
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy({
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        callbackURL: 'https://karanam-saikrishna-webdev.herokuapp.com/login/twitter/return',
        passReqToCallback : true
    },
    function (req, token, tokenSecret, profile, cb) {
        //console.log("req is ", req);
        //console.log("token is ", token);
        //console.log("the token secret is ", tokenSecret);
        //console.log("the profile secret is ", profile);
        UserController.user_connect_twitter(profile,token,tokenSecret);
        return cb(null, profile);
    }));

passport.serializeUser(function(user, cb) {
    //console.log("serialize user",user);
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    //console.log("deserialize obj",obj);
    cb(null, obj);
});

// passport done

const filterRoutes = require("./api/routes/filter.route");
const postRoutes = require("./api/routes/post.route");
const userRoutes = require('./api/routes/user.route');

mongoose.connect(
  "mongodb://heroku_xptmg5hr:9sp2bqojd2obgiccnlujse1mo@ds143241.mlab.com:43241/heroku_xptmg5hr",
  {
    useMongoClient: true
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('express-session')({    secret: "catdogcat",
                                        resave: true,
                                        maxAge: 360*5,
                                        saveUninitialized: true,
                                        cookie: {
                                            secure: false
                                        }
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get('/login/twitter',passport.authenticate('twitter'));

app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    });

// Routes which should handle requests
app.use("/api/filter", filterRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
