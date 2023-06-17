const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database/connection");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
// create an Express app

const app = express();
app.use(morgan("tiny"));

app.use(express.json());
app.use(cors());
dotenv.config();

connectDB();

const apiRouter = require("./routers/router");
app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log("Server has started on PORT " + process.env.PORT);
});
