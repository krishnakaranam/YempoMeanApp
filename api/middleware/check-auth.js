const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Tracker = require("../models/tracker.schema.server");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;

        Tracker.find({  userid: decoded.userId,
                        iat : decoded.iat,
                        exp : decoded.exp
                    })
            .exec()
            .then(tracker => {
                if (tracker.length >= 1) {
                    Tracker.update({    userid: decoded.userId,
                                        iat : decoded.iat,
                                        exp : decoded.exp
                                    } ,
                                    {'$push': {activity : {requesttype: req.url, requestdescription: req.body} }
                                    } ,
                                    {'$set': {'logouttime' : Date.now()}
                                    })
                } else {
                    const tracker = new Tracker({
                        _id: new mongoose.Types.ObjectId(),
                        userid: decoded.userId,
                        iat: decoded.iat,
                        exp: decoded.exp,
                        activity: [{
                            requesttype: req.url,
                            requestdescription: "Logged In"
                        }]
                    });
                    tracker
                        .save();
                }
            });

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};