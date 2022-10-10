const User = require("../models/User");
const jwt = require("jsonwebtoken");
const SECRET = "i love you mom";
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: maxAge });
};

// handle errors
const handleErrors = (err) => {
  // err.code is for when an email is not unique! -> error code is :11000
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //   incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered"
  }

  //  incorrect password

  if (err.message === "incorrect password") {
    errors.email = "that password is incorrect"
  }


  // if email is not unique
  if (err.code === 11000) {
    errors.email = "Email Already Exists!";
  }

  //   validation erros
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password }); // this is async
    const token = createToken(user._id); // apply jwt to the user
    res.cookie("ninja_tutorial_cookie", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    }); //store the token in cookie
    res.status(201).json({ user: user._id }); // send back the user as json
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  // we need to use express.json() as a middleware to accept json data as req.body
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password); // we made a custom method called login in user model!
    const token = createToken(user._id); // apply jwt to the user
    res.cookie("ninja_tutorial_cookie", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    }); //store the token in cookie
    res.status(200).json({ user: user._id });

  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("ninja_tutorial_cookie", "", { maxAge: 1 })
  res.redirect("/")
}