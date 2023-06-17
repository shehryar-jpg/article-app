const mongoose = require("mongoose");
const unApprovedArticles = new mongoose.Schema({
  journal: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  uni: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  searchid: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  menuscriptTitle: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  articleFileUrl: {
    type: String,
  },
  reportFileUrl: {
    type: String,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("unApprovedArticles", unApprovedArticles);
