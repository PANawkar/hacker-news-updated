const mongoose = require("mongoose");

// Define a schema for the scraped data
const pageSchema = new mongoose.Schema({
    page: Number,
    titles: String,
    href: String,
    comments: String,
    commentsURL: String,
    upVotes: String,
    times: String,
  });

module.exports = mongoose.model("Page", pageSchema);
