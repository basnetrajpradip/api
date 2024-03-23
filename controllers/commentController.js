const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");
const User = require("../models/User");

exports.comments_get = asyncHandler(async (req, res, next) => {
  const allPostComments = await Comment.find({
    post: req.params.postID,
  })
    .populate("author", "username")
    .sort({ timeStamp: -1 })
    .exec();

  res.status(200).json(allPostComments);
});

exports.comment_create_post = [
  body("comment", "Comment cannot be empty.").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
      return;
    }

    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
      if (err) {
        res.status(403).json({ message: "Error: Invalid Token" });
        return;
      }
      const comment = new Comment({
        comment: req.body.comment,
        author: payload.user.id,
        post: req.params.postID,
      });

      await comment.save();
      await BlogPost.findByIdAndUpdate(req.params.postID, {
        $push: { comments: comment },
      });
      await User.findByIdAndUpdate(payload.user.id, {
        $push: { comments: comment },
      });
      res.status(200).json(comment);
    });
  }),
];

exports.comment_delete = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      res.status(403).json({ message: "Error: Invalid Token" });
      return;
    }
    const commentToDelete = await Comment.findById(req.params.commentID);
    const currentUser = await User.findById(payload.user.id);
    const isAuthorized = currentUser.comments.includes(commentToDelete._id);

    if (!commentToDelete) {
      res.status(404).json({ message: "Error: Comment not found" });
      return;
    }

    if (!isAuthorized) {
      res.status(403).json({ message: "Error: Not authorized" });
      return;
    } else {
      await User.findByIdAndUpdate(payload.user.id, {
        $pullAll: { comments: [commentToDelete] },
      });
      await BlogPost.findByIdAndUpdate(req.params.postID, {
        $pullAll: { comments: [commentToDelete] },
      });
      await Comment.findByIdAndDelete(req.params.commentID);
      res.status(200).json({ message: "Comment successfully deleted" });
    }
  });
});
