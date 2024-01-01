const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Path: server/models/User.js


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {       // callback function to get user details, done is callback function and profile is user details
   // create new user object for storing in database for the sign up process
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value
    }

    try {
        let user = await User.findOne({googleId: profile.id});
        if(user) {
            done(null, user);
        } else {
            user = await User.create(newUser);
            done(null, user);
        }
    } catch (err) {
        console.log(err);
    }
  }
));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] })); // to authenticate user with google

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard' }),
  ); // to redirect user to dashboard after successful authentication

router.get('/login-failure', (req, res) => {
    res.send('Failed to authenticate..');
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
      if(error) {
        console.log(error);
        res.send('Error loggin out');
      } else {
        res.redirect('/')
      }
    })
  });
  

passport.serializeUser(function(user, done) {   // to store user details in session
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  


module.exports = router;