const express = require("express");
const router = express.Router();

const authenticationController = require("../controllers/authenticationController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const { verifyUser, verifyToken } = require("../middlewares/verify");

//Authentication Routes
router.post("/register", authenticationController.register_post);
router.post("/login", authenticationController.login_post);
router.post("/logout", authenticationController.logout_post);

router.get("/auth", verifyUser, authenticationController.authenticate_user);

//Blog Post Routes
router.post("/posts", verifyToken, postController.create_post);
router.get("/posts", postController.posts_get);
router.get("/posts/:postID", postController.post_details_get);
router.delete("/posts/:postID", verifyToken, postController.post_delete);
router.put("/posts/:postID", verifyToken, postController.post_edit_put);

//Comment Routes
router.get("/posts/:postID/comments", commentController.comments_get);
router.post("/posts/:postID/comments", verifyToken, commentController.comment_create_post);
router.delete("/posts/:postID/comments/:commentID", verifyToken, commentController.comment_delete);

module.exports = router;
