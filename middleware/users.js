const jwt = require("jsonwebtoken");
const {db} = require("../index");
const users = db.createCollection({
    name: 'users'
});
users.data = [];
const {v4: uuidv4} = require('uuid');

module.exports = {
    create: (req, res, next) => {
        const user = {
            id: uuidv4(),
            surname: req.body.surname,
            lastname: req.body.lastname,
            street: req.body.street,
            streetNumber: req.body.streetNumber,
            city: req.body.city,
            mail: req.body.mail,
            postCode: req.body.postCode,
            password: req.body.password
        };
        users.data.push(user);

        const token = jwt.sign({
                userId: user.id,
                password: user.password
            },
            'mysupersecretbackendtoken', {
                expiresIn: '1d'
            }
        );

        db.save(true);

        res.status(201);
        res.cookie("token", token, {maxAge: 86400})
        res.send(user);

        next();
    },

    list: (req, res) => {
        res.json(users.data);
    },

    findSingle: (req, res) => {
        let findOne = users.data.filter(user => user.id === req.params.id);
        if (!findOne || findOne.length === 0) {
            res.status(404).send("Not Found");
        } else {
            res.json(findOne);
        }
    },

    delete: (req, res) => {
        let findOne = users.data.filter(user => user.id === req.params.id);
        if (!findOne || findOne.length === 0) {
            res.status(404).send("Not Found");
        } else {
            users.data.delete(findOne);
            db.save(true);
            res.status(204).send();
        }
    },

    update: (req, res, next) => {
        let findOne = users.data.filter(user => user.id === req.params.id);

        if (!findOne || findOne.length === 0) {
            res.status(404).send("Not Found");
        }

        const user = {
            id: req.params.id,
            surname: req.body.surname,
            lastname: req.body.lastname,
            street: req.body.street,
            streetNumber: req.body.streetNumber,
            city: req.body.city,
            mail: req.body.mail,
            postCode: req.body.postCode,
            password: req.body.password
        };
        users.data.delete(findOne);
        users.data.push(user);

        db.save(true);

        res.status(204);
        res.cookie("token", token, {maxAge: 86400})
        res.send();

        next();
    },
}

