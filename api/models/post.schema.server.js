var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	userid: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true},
    creatorname: {type: String},
    creatorprofilepic: {type: String},
    createdat: {type: Date, default: new Date()},
	image: {type: String},
	text: {type: String},
    facebook: {
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }],
		shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }],
		comments: [{
			userid: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
			comment: {type: String}
		}],
		url: {type: String},
		postid: {type: String}
		},
    twitter: {
		favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
		retweets: [{
			userid: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
			retweetid: {type: String}
		}],
		url: {type: String},
		postid: {type: String}
		},
	claps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }]
}, {collection: 'Post'});

//module.exports = postSchema;
module.exports = mongoose.model('Post', postSchema);