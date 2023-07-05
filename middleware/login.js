// verify that the request comes from a logged-in user.js (crudely)
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const BlacklistedToken = require('../models/blacklistedToken');
const {logError} = require('../utils/logging');

module.exports = {
    login: (req, res) => {
        const mail = req.body.mail;
        const password = req.body.password;
        User.findOne({mail})
            .then(user => {
                if(!user){
                    return res.status(404).json({ error: 'User not found' });
                }
                return user.verifyPassword(password).then(passwordIsValid => {
                    if(!passwordIsValid){
                        return res.status(401).json({ error: 'Invalid credentials' });
                    }

                    const token = jwt.sign({ userId: user._id }, 'mysupersecretbackendtoken');
                    res.cookie("token", token, {maxAge: 86400});
                    res.status(200).json({token});
                });
            })
            .catch(err => {
                logError(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    },
    verify: (req, res, next) => {
        const token = req.headers.token;

        if(token) {
            BlacklistedToken.findOne({token})
                .then(blacklistedToken => {
                    if (blacklistedToken) {
                        return res.status(401).json({error: 'Token is blacklisted'});
                    }

                    try {
                        const payload = jwt.verify(token, 'mysupersecretbackendtoken');
                        User.findById(payload.userId)
                            .then(() => {
                                next();
                            })
                    } catch (err) {
                        logError(err);
                        res.status(400).send("Invalid token");
                    }
                })
        } else {
            res.status(401);
            res.end('Unauthorized');
        }



    },
    logout: (req, res) => {
        const token = req.headers.token;
        // Create a blacklisted token
        const blacklistedToken = new BlacklistedToken({ token });

        // Save the blacklisted token to the database
        blacklistedToken
            .save()
            .then(() => {
                res.json({ message: 'Logout successful' });
            })
            .catch(err => {
                logError(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    }
};
