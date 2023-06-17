const express = require("express");
const controller = require("../controller/controller.js");
const multer = require("multer");
const { verificationToken } = require("../middleware/requireLogin.js");
const route = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "controller/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

route.get("/users", controller.user_list);
route.post(
  "/upload/file",
  uploadStorage.single("file"),
  controller.upload_file
);

route.get("/download/:file", controller.download_file);
route.post("/publish/article", controller.push_to_un_approved_article);
route.post("/approve/article", verificationToken, controller.approve_article);
route.get("/get/articles", controller.get_articles);
route.get(
  "/get/articles/unapproved",
  verificationToken,
  controller.get_unapproved_articles
);
route.post("/signup", controller.signup);
route.post("/signin", controller.signin);

module.exports = route;
