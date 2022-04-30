require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const cors = require("cors");
require("./services/passport");

const SERVER_PORT = process.env.SERVER_PORT;
const corsOptions = require("./utils/corsOptions");

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

//routes
app.get("/", (req, res) => {
  res.send("Babajide Oyafemi's Project Explorer API");
});
app.use("/home", require("./routes/homeRoute"));
app.use("/user", require("./routes/userRoute"));
app.use("/project", require("./routes/projectRoute"));
app.use("/", require("./routes/socialRoute"));

//mongoose extra setting
mongoose.set("bufferCommands", false);
mongoose.set("useFindAndModify", false);

//MongoBD connection
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) {
      console.log("Error connecting to db: ", err);
    } else {
      console.log(`Connected to MongoDB database`);
    }
  }
);

//Server listening on port
app.listen(process.env.PORT || SERVER_PORT, () =>
  console.log("Server listening on port ")
);

module.exports = app;
