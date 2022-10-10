const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middleware #1

const requireAuth = (req, res, next) => {
    const token = req.cookies.ninja_tutorial_cookie; //getting it from the request
    const SECRET = "i love you mom";

    if (token) { //is there any valid tokens?
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect("/login")
            } else {
                console.log(decodedToken)
                next();
            }
        })
    } else {
        res.redirect("/login")
    }
}


// middleware #2

// check the current user (who is logged in) on EVERY get request for new pages , and display them in view
const currentUserChecker = (req, res, next) => {
    const token = req.cookies.ninja_tutorial_cookie;
    const SECRET = "i love you mom";
    if (token) {
        jwt.verify(token, SECRET, async (err, decodedToken) => {
            if (err) { // there is no valid user , just a random website visiter
                res.locals.user = null; // we can add things to response locals to have access in the view
                console.log(err.message)
                next();
            } else { // there is a valid user logged in at this point
                let user = await User.findById(decodedToken.id);
                // res.locals.somethingThatTheViewCanUseLOL = "Happy Birthday!"
                res.locals.user = user
                next();
            }
        })

    } else {
        res.locals.user = null;
        next();
    }

}

module.exports = { requireAuth, currentUserChecker }