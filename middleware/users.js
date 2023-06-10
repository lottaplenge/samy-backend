const User = require("../models/user");
const jwt = require("jsonwebtoken");

const selection = '_id firstName lastName street streetNumber city mail postcode createdAt updatedAt';

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
                        User.findById(result._id).select(selection)
                            .then((user) => {
                                res.cookie("token", token, {maxAge: 86400});
                                res.status(201);
                                res.send(user);
                                next();
                        });

                    })
                    .catch((err) =>{
                        console.log(err);
                        res.status(500).json({error: err});
                    })
            });


    },

    list: (req, res) => {

        User.find().select(selection)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
            });
    },

    findSingle: (req, res) => {
        User.findById(req.params.id).select(selection)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
                res.json({});
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
                console.log(err);
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
                User.findById(result._id).select(selection)
                    .then((user) => {
                        res.send(user);
                        next();
                    });
            })
            .catch((err) => {
                console.log(err);
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
                console.error(err)
                res.status(500).json({ error: 'Internal server error' });
            });
    }
}

