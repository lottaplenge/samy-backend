const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {

    create: (req, res, next) => {
        // create user in mongodb database
        const userMongo = new User({
            lastName: req.body.lastname,
            firstName: req.body.surname,
            street: req.body.street,
            streetNumber: req.body.streetNumber,
            city: req.body.city,
            mail: req.body.mail,
            postCode: req.body.postCode,
            password: req.body.password
        });

        userMongo.save()
            .then((result) =>{
                const token = jwt.sign({
                        userId: result._id,
                    },
                    'mysupersecretbackendtoken', {
                        expiresIn: '1d'
                    }
                );
                res.status(201);
                res.cookie("token", token, {maxAge: 86400})
                res.send(result);


                next();
            })
            .catch((err) =>{
                console.log(err);
            })

    },

    list: (req, res) => {

        User.find()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
            });
    },

    findSingle: (req, res) => {
        User.findById(req.params.id)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
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
                lastName: req.body.lastname,
                firstName: req.body.surname,
                street: req.body.street,
                streetNumber: req.body.streetNumber,
                city: req.body.city,
                mail: req.body.mail,
                postCode: req.body.postCode,
                password: req.body.password
            },
        },{new:true})
            .then((result) => {
                res.send(result);
                next();
            })
            .catch((err) => {
                console.log(err);
            })

    },
}

