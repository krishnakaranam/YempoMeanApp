var mongoose = require('mongoose');

var trackerSchema = mongoose.Schema({
	userid: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true},
	logintime: {type: Date, default: new Date()},
	activity: [{
				requesttype: {type: String},
				requestdescription: {type: String},
				requesttime: {type: Date, default: new Date()}
				}],
	logouttime: {type: Date}
}, {collection: 'Tracker'});

//module.exports = trackerSchema;
module.exports = mongoose.model('Tracker', trackerSchema);