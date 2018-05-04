const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/post');

// multer
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});

//app.post('/fileupload', upload.single('image'), (req, res, next) => {
//    res.json({'message': 'File uploaded successfully'});
//});
// multer

router.get("/feed/:userId", checkAuth, PostController.get_feed);

router.post("/create/:userId", checkAuth, PostController.create_post);

router.post("/create/image/:userId", checkAuth, upload.single('image'), PostController.create_post_image);

router.get("/favorite/:userId/:postId", checkAuth, PostController.favorite_post);

router.get("/unfavorite/:userId/:postId", checkAuth, PostController.unfavorite_post);

router.get("/clap/:userId/:postId", checkAuth, PostController.clap_post);

router.get("/unclap/:userId/:postId", checkAuth, PostController.unclap_post);

router.get("/retweet/:userId/:postId", checkAuth, PostController.retweet_post);

router.get("/unretweet/:userId/:postId", checkAuth, PostController.unretweet_post);

router.get("/reach/likes/:userId", checkAuth, PostController.total_post_likes);

router.get("/reach/comments/:userId", checkAuth, PostController.total_post_comments);

router.get("/reach/shares/:userId", checkAuth, PostController.total_post_shares);

module.exports = router;
