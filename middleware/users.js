const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logging = require('../utils/logging');
const logError = logging.logError;

module.exports = {

    create: (req, res, next) => {
        const mail = req.body.mail;
        User.findOne({mail})
            .then(existingUser => {
                if(existingUser){
                    return res.status(409).json({ error: 'User already exists' });
                }
                // create user in mongodb database
                const userMongo = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    street: req.body.street,
                    streetNumber: req.body.streetNumber,
                    city: req.body.city,
                    mail: req.body.mail,
                    postCode: req.body.postCode,
                    password: req.body.password
                });

                return userMongo.save()
                    .then((result) =>{
                        const token = jwt.sign({ userId: result._id }, 'mysupersecretbackendtoken');
                        User.findById(result._id).select('_id firstName lastName street streetNumber city mail postcode createdAt updatedAt')
                            .then((user) => {
                                res.cookie("token", token, {maxAge: 86400});
                                res.status(201);
                                res.send(user);
                                next();
                        });

                    })
                    .catch((err) =>{
                        logError(err);
                        res.status(500).json({error: err});
                    })
            });


    },

    list: (req, res) => {

        User.find().select('_id firstName lastName street streetNumber city mail postcode createdAt updatedAt')
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                logError(err);
            });
    },

    findSingle: (req, res) => {
        User.findById(req.params.id).select('_id firstName lastName street streetNumber city mail postcode createdAt updatedAt')
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                logError(err);
                res.status(404).json({error: "User not found"})
            })

    },

    delete: (req, res) => {
        User.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({
                    msg: "User deleted!",
                });
            })
            .catch((err) => {
                logError(err);
            })

    },

    update: (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                street: req.body.street,
                streetNumber: req.body.streetNumber,
                city: req.body.city,
                mail: req.body.mail,
                postCode: req.body.postCode,
            },
        },{new:true})
            .then((result) => {
                User.findById(result._id).select('_id firstName lastName street streetNumber city mail postcode createdAt updatedAt')
                    .then((user) => {
                        res.send(user);
                        next();
                    });
            })
            .catch((err) => {
                res.status(400).json({error: err});
                logError(err);
            })

    },
    updatePassword(req, res, next){
        const userId = req.params.id;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                return user.verifyPassword(currentPassword).then(isPasswordValid => {
                    if (!isPasswordValid) {
                        return res.status(401).json({ error: 'Invalid current password' });
                    }

                    user.password = newPassword;
                    return user.save();
                });
            })
            .then(() => {
                res.json({ message: 'Password updated successfully' });
            })
            .catch(err => {
                logError(err)
                res.status(500).json({ error: 'Internal server error' });
            });
    }
}

