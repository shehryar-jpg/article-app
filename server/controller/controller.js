const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const unApprovedArticles = require("../model/unApprovedArticles");
const approvedArticles = require("../model/approvedArticles");
const users = require("../model/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

dotenv.config();

exports.user_list = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  try {
    let users = ["Tony", "Lisa", "Michael", "Ginger", "Food"];
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.upload_file = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  try {
    const file = req.file;
    if (!file) {
      return res.status(500).json({
        message: "File did not uploaded successfully",
        data: null,
        error: true,
      });
    }
    file.path = `${file.path}.pdf`;

    return res.status(200).json({
      message: "File uploaded successfully",
      data: { path: file.path.slice(11, -4) },
      error: false,
    });
  } catch (error) {
    console.log(error);
  }

  // Move the uploaded file to the app's root directory with a .pdf extension
};

exports.download_file = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  try {
    const filetodownlaod = req.params["file"];
    res.download(`./controller/${filetodownlaod}`);
  } catch (error) {
    console.log(error);
  }
};

exports.push_to_un_approved_article = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  try {
    const {
      journal,
      title,
      article,
      firstName,
      lastName,
      email,
      uni,
      phone,
      searchid,
      address,
      menuscriptTitle,
      abstract,
      reportFile,
      articleFile,
    } = req.body;

    const newUnApprovedArticle = new unApprovedArticles({
      journal,
      title,
      article,
      firstName,
      lastName,
      email,
      uni,
      phone,
      searchid,
      address,
      menuscriptTitle,
      abstract,
      articleFileUrl: articleFile,
      reportFileUrl: reportFile,
    });

    const result = await newUnApprovedArticle.save();

    res.status(200).json({
      data: {
        result,
      },
      error: false,
      message: "Data inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error: true,
      message: "Internal server error",
    });
    console.log(error);
  }
};

exports.approve_article = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  try {
    const { avaLink, unApprovedArticleId, reportFile, articleFile } = req.body;

    const unapprovedarticle = await unApprovedArticles.find({
      _id: unApprovedArticleId,
    });

    console.log(unapprovedarticle[0]);

    let approvedarticle;
    if (!reportFile) {
      approvedarticle = new approvedArticles({
        journal: unapprovedarticle[0].journal,
        article: unapprovedarticle[0].article,
        menuscriptTitle: unapprovedarticle[0].menuscriptTitle,
        articleFileUrl: unapprovedarticle[0].articleFileUrl,
        reportFileUrl: unapprovedarticle[0].reportFileUrl,
        avaLink,
      });
    } else {
      approvedarticle = new approvedArticles({
        journal: unapprovedarticle[0].journal,
        article: unapprovedarticle[0].article,
        menuscriptTitle: unapprovedarticle[0].menuscriptTitle,
        articleFileUrl: articleFile,
        reportFileUrl: reportFile,
        avaLink,
      });
    }

    const result = await approvedarticle.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Replace with the appropriate port number
      auth: {
        user: "databytes321@gmail.com",
        pass: "qruccagteaawlydv",
      },
    });

    var mailOptions = {
      from: "databytes321@gmail.com",
      to: unapprovedarticle[0].email,
      subject: "Availability of Your Submitted Article on MedCrave",
      text: `
Dear ${unapprovedarticle[0].firstName} ${unapprovedarticle[0].lastName},

We are pleased to inform you that your submitted article to MedCrave has been processed and is now available for viewing. You can access your article using the following URL:

${avaLink}

Thank you for choosing MedCrave as the platform for publishing your research. Should you have any further inquiries or require any assistance, please do not hesitate to reach out to us.

Best regards,
MedCrave Publishing
      
      `,
    };

    let email = await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const delete_result = await unApprovedArticles.deleteOne({
      _id: unApprovedArticleId,
    });

    res.status(200).json({
      data: null,
      error: false,
      message: "Data inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error: true,
      message: "Internal server error",
    });
    console.log(error.message);
  }
};

exports.get_articles = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 8;

    const articles = await approvedArticles
      .find()
      .sort({ _id: -1 })
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({
      data: articles,
      error: false,
      message: "Data inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error: true,
      message: "Internal server error",
    });
    console.log(error.message);
  }
};

exports.get_unapproved_articles = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 6;
  const articles = req.query.articles || "to-publish";

  try {
    let unapprovedArticles;
    if (articles == "to-publish") {
      unapprovedArticles = await unApprovedArticles
        .find({ reportFileUrl: { $ne: "" } })
        .skip(page * limit)
        .sort({ created_at: -1 })
        .limit(limit);
    } else {
      unapprovedArticles = await unApprovedArticles
        .find({ reportFileUrl: { $eq: "" } })
        .skip(page * limit)
        .sort({ created_at: -1 })
        .limit(limit);
    }

    res.status(200).json({
      data: unapprovedArticles,
      error: false,
      message: "Data inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error: true,
      message: "Internal server error",
    });
    console.log(error.message);
  }
};

exports.signup = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  // required validate request
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    bcrypt.hash(password, 15).then((hashedpassword) => {
      const user = new users({
        username,
        password: hashedpassword,
      });
      user
        .save()
        .then((user) => {
          res.json({
            message: "Admin added successfully",
            data: null,
            error: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.signin = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  // required validate request

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ error: "Please provide email or password" });
  }
  users
    .findOne({ username: username })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password" });
      }
      bcrypt.compare(password, savedUser.password).then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET_KEY
          );
          savedUser.password = undefined;
          res.status(200).json({
            data: { token },
            message: "Login successfull",
            error: false,
          });
        } else {
          return res
            .status(422)
            .json({ data: null, message: "Login failed", error: true });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
