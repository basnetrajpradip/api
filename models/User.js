const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAuthor: { type: Boolean, default: false },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }],
});

module.exports = mongoose.model("User", UserSchema);
