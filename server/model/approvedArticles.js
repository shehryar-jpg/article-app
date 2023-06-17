const mongoose = require("mongoose");
const approvedArticles = new mongoose.Schema({
  journal: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    required: true,
  },
  menuscriptTitle: {
    type: String,
    required: true,
  },
  articleFileUrl: {
    type: String,
  },
  reportFileUrl: {
    type: String,
  },
  avaLink: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("approvedArticles", approvedArticles);
