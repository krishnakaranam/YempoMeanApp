const mongoose = require("mongoose");
var Twit = require('twit');
const User = require("../models/user.schema.server");

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
            screennames: user.twitter.mutualconnections.slice(1).sort(sortit).slice(0, 5).map(a => a.screen_name),
            followerlength : user.twitter.mutualconnections.slice(1).sort(sortit).slice(0, 5).map(a => a.mutual_connection)
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
            screennames: user.twitter.mutualconnections.slice(1).sort(sortit).slice(user.twitter.mutualconnections.length-6, user.twitter.mutualconnections.length).map(a => a.screen_name),
            followerlength: user.twitter.mutualconnections.slice(1).sort(sortit).slice(user.twitter.mutualconnections.length-6, user.twitter.mutualconnections.length).map(a => a.mutual_connection)
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
            screennames: user.twitter.gateway.sort(sortit).slice(0, 5).map(a => a.screen_name),
            followerlength: user.twitter.gateway.sort(sortit).slice(0, 5).map(a => a.len)
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
            screennames: user.twitter.followers.sort(sortactive).slice(0, 5).map(a => a.screen_name),
            followerlength: user.twitter.followers.sort(sortactive).slice(0, 5).map(a => a.statuses_count)
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
            screennames: user.twitter.followers.sort(sortactive).slice(user.twitter.followers.length-5, user.twitter.followers.length).map(a => a.screen_name),
            followerlength: user.twitter.followers.sort(sortactive).slice(user.twitter.followers.length-5, user.twitter.followers.length).map(a => a.statuses_count)
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
            screennames: user.twitter.followers.sort(sortinteractive).slice(0, 5).map(a => a.screen_name),
            followerlength: user.twitter.followers.sort(sortinteractive).slice(0, 5).map(a => a.favourites_count)
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
