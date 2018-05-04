const mongoose = require("mongoose");
var Twit = require('twit');
const bcrypt = require("bcrypt");
const fs = require("fs");
const User = require("../models/user.schema.server");
const Post = require("../models/post.schema.server");

exports.get_feed = (req, res, next) => {
    const id = req.params.userId;
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            if (user.length >= 1) {
    Post.find()
        .sort({"datetime": -1}).limit(200)
        .exec()
        .then(posts => {

            const response = {
                count: posts.length,
                posts: posts.map(post => {
                    var Clapped = true;
                    var Liked = true;
                    var Shared = true;
                    var Favorited = true;
                    var Retweeted = false;
                    if (post.claps.indexOf((id.toString())) === -1){
                        var Clapped = false;
                    }if (post.facebook.likes.indexOf((id.toString())) === -1){
                        var Liked = false;
                    }if (post.facebook.shares.indexOf((id.toString())) === -1){
                        var Shared = false;
                    }if (post.twitter.favorites.indexOf((id.toString())) === -1){
                        var Favorited = false;
                    }
                    for(var i = 0; i < post.twitter.retweets.length; i++) {
                        if (post.twitter.retweets[i].userid == id.toString()) {
                            Retweeted = true;
                            break;
                        }
                    }
                    return {
                        profilepic: post.creatorprofilepic,
                        username: post.creatorname,
                        claps: post.claps.length,
                        clapped: Clapped,
                        image: post.image,
                        text: post.text,
                        likes: post.facebook.likes.length,
                        liked: Liked,
                        shares: post.facebook.shares.length,
                        shared: Shared,
                        favorites: post.twitter.favorites.length,
                        favorited: Favorited,
                        retweets: post.twitter.retweets.length,
                        retweeted: Retweeted,
                        facebookurl: post.facebook.url,
                        twitterurl: post.twitter.url,
                        _id: post._id
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
});
};

exports.create_post = (req, res, next) => {
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                var T = new Twit({
                    consumer_key:         process.env.CONSUMER_KEY,
                    consumer_secret:      process.env.CONSUMER_SECRET,
                    access_token:         user[0].twitter.token,
                    access_token_secret:  user[0].twitter.tokensecret
                });

                var statusOptions = { status: req.body.text.substr(0, 280) };

                if(req.body.media != 'null'){
                    statusOptions = { media_ids: new Array(req.body.media),
                                      status: req.body.text.substr(0, 280) };
                }

                T.post('statuses/update', statusOptions, function (err, data, response) {
                    if (err){
                        res.status(500).json({
                            error: err
                        });
                    }
                    else{
                        if(data.entities.media != undefined){
                            const post = new Post({
                                _id: new mongoose.Types.ObjectId(),
                                userid: req.params.userId,
                                creatorname: data.user.name,
                                creatorprofilepic: user[0].profilepic,
                                text: req.body.text,
                                image : data.entities.media[0].media_url_https,
                                twitter : {
                                    url : "https://twitter.com/"+data.user.screen_name+"/status/"+data.id_str,
                                    postid : data.id_str }
                            });
                            post
                                .save()
                                .then(result => {
                                    res.status(201).json({
                                        message: "Created post successfully"
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }else {
                            const post = new Post({
                                _id: new mongoose.Types.ObjectId(),
                                userid: req.params.userId,
                                creatorname: data.user.name,
                                creatorprofilepic: user[0].profilepic,
                                text: req.body.text,
                                twitter : {
                                    url : "https://twitter.com/"+data.user.screen_name+"/status/"+data.id_str,
                                    postid : data.id_str }
                            });
                            post
                                .save()
                                .then(result => {
                                    res.status(201).json({
                                        message: "Created post successfully"
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    }
                });
            }
        });
};

exports.create_post_image = (req, res, next) => {
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            var T = new Twit({
                consumer_key:         process.env.CONSUMER_KEY,
                consumer_secret:      process.env.CONSUMER_SECRET,
                access_token:         user[0].twitter.token,
                access_token_secret:  user[0].twitter.tokensecret
            });

            var image_path = 'uploads/' + req.file.filename;
            var b64content = fs.readFileSync(image_path, { encoding: 'base64' });

            T.post('media/upload', { media_data: b64content }, function (err, media, response) {
                if (err){
                    res.status(500).json({
                        error: err
                    });
                }
                else{ // media_ids: new Array(media.media_id_string),
                    res.json({ media: media.media_id_string });
                }
            });
        });
};

exports.favorite_post = (req, res, next) => {
    const userid = req.params.userId;
    const postid = req.params.postId;
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            var T = new Twit({
                consumer_key:         process.env.CONSUMER_KEY,
                consumer_secret:      process.env.CONSUMER_SECRET,
                access_token:         user[0].twitter.token,
                access_token_secret:  user[0].twitter.tokensecret
            });

            Post.find({ _id: req.params.postId })
                .exec()
                .then(post => {

                    T.post('favorites/create', { id: post[0].twitter.postid }, function (err, data, response) {
                        if (err){
                            res.status(500).json({
                                error: err
                            });
                        }
                        else{
                            post[0].twitter.favorites.push(userid);
                            Post.update({_id: postid},{ $set: {
                            	twitter:  { favorites : post[0].twitter.favorites,
                                    retweets : post[0].twitter.retweets,
                                    url : post[0].twitter.url,
                                    postid : post[0].twitter.postid} } })
                                .exec()
                                .then(post => {
                                    if (post) {
                                        res.status(200).json({
                                            message: "Post favorited."
                                        });
                                    } else {
                                        res
                                            .status(404)
                                            .json({ message: "Post Not found." });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    });
                });
        });
};

exports.unfavorite_post = (req, res, next) => {
    const userid = req.params.userId;
    const postid = req.params.postId;
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            var T = new Twit({
                consumer_key:         process.env.CONSUMER_KEY,
                consumer_secret:      process.env.CONSUMER_SECRET,
                access_token:         user[0].twitter.token,
                access_token_secret:  user[0].twitter.tokensecret
            });

            Post.find({ _id: req.params.postId })
                .exec()
                .then(post => {

                    T.post('favorites/destroy', { id: post[0].twitter.postid }, function (err, data, response) {
                        if (err){
                            res.status(500).json({
                                error: err
                            });
                        }
                        else{
                            post[0].twitter.favorites.splice(post[0].twitter.favorites.indexOf(userid), 1);
                            Post.update({_id: postid},{ $set: {twitter:
										{ favorites : post[0].twitter.favorites,
                                        retweets : post[0].twitter.retweets,
                                        url : post[0].twitter.url,
                                        postid : post[0].twitter.postid} } })
                                .exec()
                                .then(post => {
                                    if (post) {
                                        res.status(200).json({
                                            message: "Post unfavorited."
                                        });
                                    } else {
                                        res
                                            .status(404)
                                            .json({ message: "Post Not found." });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    });
                });
        });
};

exports.retweet_post = (req, res, next) => {
    const userid = req.params.userId;
    const postid = req.params.postId;
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            var T = new Twit({
                consumer_key:         process.env.CONSUMER_KEY,
                consumer_secret:      process.env.CONSUMER_SECRET,
                access_token:         user[0].twitter.token,
                access_token_secret:  user[0].twitter.tokensecret
            });

            Post.find({ _id: req.params.postId })
                .exec()
                .then(post => {

                    T.post('statuses/retweet/:id', { id: post[0].twitter.postid  }, function (err, data, response) {
                        if (err){
                            res.status(500).json({
                                error: err
                            });
                        }
                        else{
                            post[0].twitter.retweets.push({userid :userid, retweetid: data.id });
                            Post.update({_id: postid},{ $set: {twitter:
										{ favorites : post[0].twitter.favorites,
                                        retweets : post[0].twitter.retweets,
                                        url : post[0].twitter.url,
                                        postid : post[0].twitter.postid} } })
                                .exec()
                                .then(post => {
                                    if (post) {
                                        res.status(200).json({
                                            message: "Post retweeted."
                                        });
                                    } else {
                                        res
                                            .status(404)
                                            .json({ message: "Post Not found." });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    });
                });
        });
};

exports.unretweet_post = (req, res, next) => {

    const userid = req.params.userId;
    const postid = req.params.postId;
    User.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            var T = new Twit({
                consumer_key:         process.env.CONSUMER_KEY,
                consumer_secret:      process.env.CONSUMER_SECRET,
                access_token:         user[0].twitter.token,
                access_token_secret:  user[0].twitter.tokensecret
            });

            Post.find({ _id: req.params.postId })
                .exec()
                .then(post => {

                    T.post('statuses/unretweet/:id', { id: post[0].twitter.postid  }, function (err, data, response) {
                        if (err){
                            res.status(500).json({
                                error: err
                            });
                        }
                        else{

                            post[0].twitter.retweets.splice(post[0].twitter.retweets.indexOf({userid :userid, retweetid: data.id }), 1);
                            Post.update({_id: postid},{ $set: {twitter:
                                        { favorites : post[0].twitter.favorites,
                                            retweets : post[0].twitter.retweets,
                                            url : post[0].twitter.url,
                                            postid : post[0].twitter.postid}} })
                                .exec()
                                .then(post => {
                                    if (post) {
                                        res.status(200).json({
                                            message: "Post un-retweeted."
                                        });
                                    } else {
                                        res
                                            .status(404)
                                            .json({ message: "Post Not found." });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({ error: err });
                                });
                        }
                    });
                });
        });
};

exports.clap_post = (req, res, next) => {
    const userid = req.params.userId;
    const postid = req.params.postId;

    Post.update({_id: postid},{ $push: { claps: userid } })
        .exec()
        .then(post => {
            if (post) {
                res.status(200).json({
                    message: "Post clapped."
                });
            } else {
                res
                    .status(404)
                    .json({ message: "Post Not found." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.unclap_post = (req, res, next) => {
    const userid = req.params.userId;
    const postid = req.params.postId;

    Post.update({_id: postid},{ $pull: { claps: userid } })
        .exec()
        .then(post => {
            if (post) {
                res.status(200).json({
                    message: "Post unclapped."
                });
            } else {
                res
                    .status(404)
                    .json({ message: "Post Not found." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.total_post_likes = (req, res, next) => {
    const userid = req.params.userId;
    Post.aggregate(
        [{
            $match: { "userid" : mongoose.Types.ObjectId(userid) } },
        {
            $project: {
                    "favorites": { $size: "$twitter.favorites" }
            }
        },
        {
            $group : {
                "_id": mongoose.Types.ObjectId(userid),
                "count": {
                    "$sum": "$favorites"
                }
            }
        }])
        .exec()
        .then(response => {
            res
                .status(200)
                .json({ message: response });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


exports.total_post_comments = (req, res, next) => {
    const userid = req.params.userId;
    Post.aggregate(
        [{
            $match: { "userid" : mongoose.Types.ObjectId(userid) } },
            {
                $project: {
                    "comments": { $size: "$facebook.comments" }
                }
            },
            {
                $group : {
                    "_id": mongoose.Types.ObjectId(userid),
                    "count": {
                        "$sum": "$comments"
                    }
                }
            }])
        .exec()
        .then(response => {
            res
                .status(200)
                .json({ message: response});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.total_post_shares = (req, res, next) => {
    const userid = req.params.userId;

    Post.aggregate(
        [{
            $match: { "userid" : mongoose.Types.ObjectId(userid) } },
            {
                $project: {
                    "retweets": { $size: "$twitter.retweets" }
                }
            },
            {
                $group : {
                    "_id": mongoose.Types.ObjectId(userid),
                    "count": {
                        "$sum": "$retweets"
                    }
                }
            }])
        .exec()
        .then(response => {
            res
                .status(200)
                .json({ message: response});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};