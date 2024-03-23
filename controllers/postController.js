const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BlogPost = require("../models/BlogPost");

//Create blog post on POST
exports.create_post = [
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("content", "Content must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("image", "Image must not be empty").trim().isLength({ min: 1 }).escape(),

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
      if (payload.user.isAuthor) {
        const blogPost = new BlogPost({
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          author: payload.user.id,
        });

        await blogPost.save();
        res.status(200).json(blogPost);
      } else {
        res.status(403).json({ message: "Error: Unauthorized author.", payload });
      }
    });
  }),
];

//Serve all blog posts on GET
exports.posts_get = asyncHandler(async (req, res, next) => {
  const allPosts = await BlogPost.find().sort({ timeStamp: -1 }).populate("author", "username").exec();

  if (!allPosts) {
    res.status(404).json({ message: "Error: No posts found" });
    return;
  }
  res.status(200).json(allPosts);
});

exports.post_details_get = asyncHandler(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.postID).populate("author", "username").exec();
  if (!post) {
    res.status(404).json({ message: "Error: No post found" });
    return;
  }
  res.status(200).json(post);
});

//Update blog post on PUT
exports.post_edit_put = [
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("content", "Content must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("image", "Image must not be empty").trim().isLength({ min: 1 }).escape(),

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
      if (payload.user.isAuthor) {
        const updatedBlogPostDetails = {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          author: payload.user.id,
        };

        const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.postID, updatedBlogPostDetails, { new: true });

        if (!updatedBlogPost) {
          res.status(404).json({ message: "Error: Post not found." });
          return;
        }
        res.status(200).json(updatedBlogPost);
      } else {
        res.status(403).json({ message: "Error: Unauthorized author.", payload });
        return;
      }
    });
  }),
];

//Remove blog post on DELETE
exports.post_delete = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      res.status(403).json({ message: "Error: Invalid Token" });
      return;
    }
    if (payload.user.isAuthor) {
      const postToDelete = await BlogPost.findById(req.params.postID);

      if (!postToDelete) {
        res.status(404).json({ message: "Error: Post not found" });
        return;
      }
      if (postToDelete.comments.length === 0) {
        await BlogPost.findByIdAndDelete(req.params.postID);
        res.status(200).json({ message: "Post successfully deleted" });
        return;
      }
    }
  });
});
