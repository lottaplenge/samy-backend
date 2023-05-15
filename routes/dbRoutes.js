const express = require('express');
const User = require('../models/user');
const signUp = require('../middleware/sign-up.js');
const users = require('../middleware/users.js');


const dbRoutes = express.Router();

dbRoutes.post('/sign-up', signUp.validate, users.create);
dbRoutes.post('/create-user', (req, res) => {
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
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err)
        })
});

module.exports = dbRoutes;