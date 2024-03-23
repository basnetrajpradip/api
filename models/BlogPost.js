const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");

const BlogPostSchema = new Schema({
  title: { type: String, required: trues },
  image: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comments", required: true }],
  timeStamp: { type: Date, required: true, default: Date.now },
});

BlogPostSchema.virtual("formattedTimestamp").get(function () {
  return TimeAgo.format(this.timestamp);
});

module.exports = mongoose.model("BlogPost", BlogPostSchema);
