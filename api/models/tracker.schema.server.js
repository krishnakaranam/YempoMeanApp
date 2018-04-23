var mongoose = require('mongoose');

var trackerSchema = mongoose.Schema({
	userid: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true},
    logintime: {type: Date, default: new Date()},
    iat: {type: String},
	activity: [{
				requesttype: {type: String},
				requestdescription: {},
				requesttime: {type: Date, default: new Date()}
				}],
    exp: {type: String}
}, {collection: 'Tracker'});

//module.exports = trackerSchema;
module.exports = mongoose.model('Tracker', trackerSchema);