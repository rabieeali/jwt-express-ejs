const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// fire a function before doc saved in db
userSchema.pre("save", async function (next) {
  // the "this" keyword points to User instance here(which is the user that's signingup)
  //   console.log(this);
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// fire a function after doc saved in db
userSchema.post("save", function (doc, next) {
  //   console.log(doc);
  next();
});

// static method to login a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    // do we have this user?
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error ("incorrect password")
  }
  throw Error("incorrect email");
};

// the name should be the singular of the name of database => "user"
const User = mongoose.model("user", userSchema);
module.exports = User;
