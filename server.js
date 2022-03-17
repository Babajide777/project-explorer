require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const mongoose = require("mongoose");
const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const MongoStore = require("connect-mongo");
const passport = require("passport");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "mySessions",
    }),
    resave: true,
    saveUninitialized: false,
  })
);

app.use("/api", require("./routes/api"));
app.use(flash());
app.use("/home", require("./routes/homeRoute"));
app.use("/user", require("./routes/userRoute"));
app.use("/project", require("./routes/projectRoute"));
app.use("/auth", require("./routes/socialRoute"));

// app.use("/", require("./controllers/user"));
// app.use("/", require("./controllers/auth"));

app.use("/", require("./controllers/project"));
app.use(express.static("public"));

mongoose.set("bufferCommands", false);
mongoose.set("useFindAndModify", false);

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

app.listen(process.env.PORT || SERVER_PORT, () =>
  console.log("Server listening on port ")
);

module.exports = app;
