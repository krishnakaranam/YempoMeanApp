const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.schema.server");
const populateFilters = require("../helpers/filterdata");

exports.user_signup = (req, res, next) => {
  User.find({ username: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User already registered."
        });
      } else {
        bcrypt.hash(req.body.password, 2, (err, hash) => {
          if (err) {
              console.log("error here");
            return res.status(500).json({
              error: err
            });
          } else {
			if (req.body.registrationkey === process.env.REGISTRATION_KEY) {
				const user = new User({
				_id: new mongoose.Types.ObjectId(),
				username: req.body.email,
				password: hash,
                name : req.body.name,
                twitter : { screenname : req.body.screenname }
				});
				user
				.save()
				.then(result => {
					console.log(result);
					res.status(201).json({
					message: "User created"
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({
					error: err
					});
				});
			} else {
				return res.status(500).json({
              message: "Incorrect Registration Key"
            });
			}
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ username: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User doesn't exist. Please Register."
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Wrong Password."
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].username,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Login successful",
            _id : user[0]._id,
            token: token
          });
        }
        res.status(401).json({
          message: "Login failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_profile = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then(user => {

      if (user) {
        res.status(200).json({
          profilepic: user.profilepic,
		  name: user.name,
		  username: user.username,
          connected : (user.twitter.token !== 'token')
        });
      } else {
        res
          .status(404)
          .json({ message: "No user found." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.user_connect_twitter = (profile, token, tokenSecret) => {
    User.find({ "twitter.screenname" : profile.username })
        .exec()
        .then(user => {
            populateFilters.getTheFollowers(profile.username,[],
                {
                    consumer_key:         process.env.CONSUMER_KEY ,
                    consumer_secret:      process.env.CONSUMER_SECRET ,
                    access_token:         token,
                    access_token_secret:  tokenSecret
                }).then( data =>{
                    user[0].twitter.followers = data;
                    populateFilters.gatewayToOutsideArray(data,
                        {
                            consumer_key:         process.env.CONSUMER_KEY ,
                            consumer_secret:      process.env.CONSUMER_SECRET ,
                            access_token:         token,
                            access_token_secret:  tokenSecret
                        }).then( gateway =>{
                            console.log("gateway data :", gateway);
                            if (user.length === 1) {
                                User.update({    "username" : user[0].username
                                    },
                                    {'$set': { "twitter" : {
                                                token : token,
                                                tokensecret : tokenSecret,
                                                screenname : user[0].twitter.screenname,
                                                followers : user[0].twitter.followers,
                                                mutualconnections : user[0].twitter.mutualconnections,
                                                gateway : gateway
                                            },
                                            "profilepic" : profile._json.profile_image_url_https.replace("_normal", "")
                                        },

                                    }).exec();
                            } else {
                                console.log("user not found");
                            }
                        });
                });
        });
};
