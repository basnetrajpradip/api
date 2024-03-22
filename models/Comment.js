const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");

const CommentSchema = new Schema({
  comment: { type: String, required: true, maxLength: 500 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
  timeStamp: { type: Date, required: true, default: Date.now },
});

CommentSchema.virtual("formattedTimestamp").get(function () {
  return TimeAgo.format(this.timestamp);
});

module.exports = mongoose.model("Comment", CommentSchema);
