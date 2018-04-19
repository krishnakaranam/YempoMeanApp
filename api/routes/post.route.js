const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/post');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    console.log("image input");
    cb(null, true);
  } else {
    console.log("error");
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/feed/:userId", PostController.get_feed);

router.post("/create/:userId", checkAuth, PostController.create_post);

router.post("/create/image/:userId", checkAuth, upload.single('postImage'), PostController.create_post_image);

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
