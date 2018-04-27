var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	name: {type: String},
	profilepic: {type: String},
    facebook: {
		token: {type: String},
		name: {type: String}
	},
    twitter: {
        token: {type: String, default : "token"},
		tokensecret: {type: String, default : "tokensecret"},
		screenname: {type: String},
		followers : {type : Array , default : [] },
		mutualconnections : {type : Array , default : [] },
		gateway : {type : Array , default : [] },
		createdat: {type: Date, default: new Date()}
	}
}, {collection: 'User'});

//module.exports = userSchema;
module.exports = mongoose.model('User', userSchema);