const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, currentUserChecker } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://ali123:ali123@smoothiescluster.vyvwqje.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// routes
app.get("*", currentUserChecker)
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies")); // make any route protected by 
app.use(authRoutes);

//////////////// TIPS ///////////////////
// COOKIES! , EVERYTHING YOU NEED TO KNOW
/////////////////////////////////////////

// app.get("/set-cookies", (req, res) => {
// res.setHeader("Set-Cookie", "newUser=true");
// res.cookie("newUser", false);
// res.cookie("isEmployee", true, {
// maxAge: 86400000, // one day in miliseconds
// secure: true, // only sets cookie if we have an http secure connection
//  httpOnly: true, //  cookie is not avaliable for js!
// });
// res.send("you have the cookies!");
// });

// app.get("/read-cookies", (req, res) => {
// const cookies = req.cookies;
// res.json(cookies.isEmployee)
// console.log(cookies)
// });
