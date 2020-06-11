const User = require('../models').User;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        User.findOne({email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.', status: 10
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.', status: 10
                });
            }
            return done(null, user);
        });
    }
));


passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },

    function (accessToken, refreshToken, profile, done) {

        console.log('PASSPORT___: ', accessToken, refreshToken, 'profile: ', profile, 'done: ', done);

        User.findOne({
            email: profile.emails[0].value
        }, function (err, user) {
            console.log('user found', user);
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('user not found', profile);

                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    provider: 'google',
                    //now in the future searching on User.findOne({'googleId': profile.id } will match because of this next line
                    google: profile._json
                });
                let token = user.generateJwt();
                user.setPassword(profile.id);
                user.save(function (err) {
                    console.log('user save', user);
                    if (err) console.log(err);
                    return done(err, user, token);
                });
            } else {
                let token = user.generateJwt();
                return done(err, user, token);
            }
        });
    }
));

// Serialize user into the sessions
passport.serializeUser((user, done) => {
    console.log('serialize');
    done(null, user)});

// Deserialize user from the sessions
passport.deserializeUser((user, done) => {
    console.log('deserialize');
    done(null, user)});
