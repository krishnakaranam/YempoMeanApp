const mongoose = require("mongoose");
var Twit = require('twit');
const User = require("../models/user.schema.server");

exports.filter_message = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.filter_most_followers = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
		res.status(200).json({
        message: "most followers",
        mostfollowers: {
          list: user.twitter.mutualconnections.sort(sortit).slice(0, 5)
        }
      });
	  }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.filter_least_followers = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
		res.status(200).json({
        message: "least followers",
        leastfollowers: {
          list: user.twitter.mutualconnections.sort(sortit).slice(user.twitter.mutualconnections.length-5, user.twitter.mutualconnections.length)
        }
      });
	  }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.filter_gateway = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
		res.status(200).json({
        message: "gateway",
        gateway: {
          list: user.twitter.gateway.sort(sortit).slice(0, 5)
        }
      });
	  }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.filter_most_active = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
		res.status(200).json({
        message: "most active",
        gateway: {
          list: user.twitter.followers.sort(sortactive).slice(0, 5)
        }
      });
	  }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.filter_least_active = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
		res.status(200).json({
        message: "least active",
        gateway: {
          list: user.twitter.followers.sort(sortactive).slice(user.twitter.followers.length-5, user.twitter.followers.length)
        }
      });
	  }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.filter_most_interactive = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
		res.status(200).json({
        message: "most interactive",
        gateway: {
          list: user.twitter.followers.sort(sortinteractive).slice(0, 5)
        }
      });
	  }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

function sortit(a,b){
	return(b.followers_count - a.followers_count)
	}

function sortactive(a,b){
	return(b.statuses_count - a.statuses_count)
	}

function sortinteractive(a,b){
	return(b.favourites_count - a.favourites_count)
	}
