const {db} = require("../index");
const offers = db.createCollection({
    name: 'offers'
});
offers.data = [];
const {v4: uuidv4} = require('uuid');

module.exports = {
    create: (req, res, next) => {
        const offer = {
            id: uuidv4(),
            offeror : req.body.offeror,
            school : req.body.school,
            schoolClass : req.body.schoolClass,
            firstSchoolDay : req.body.firstSchoolDay,
            creationTime : req.body.creationTime
        };
        offers.data.push(offer);

        db.save(true);

        res.status(201);
        res.send(offer);

        next();
    },

    list: (req, res) => {
        res.json(offers.data);
    },

    findSingle: (req, res) => {
        let findOne = offers.data.filter(offer => offer.id === req.params.id);
        if (!findOne || findOne.length === 0) {
            res.status(404).send("Not Found");
        } else {
            res.json(findOne);
        }
    },

    delete: (req, res) => {
        let findOne = offers.data.filter(offer => offer.id === req.params.id);
        if (!findOne || findOne.length === 0) {
            res.status(404).send("Not Found");
        } else {
            offers.data.delete(findOne);
            db.save(true);
            res.status(204).send();
        }
    },

    update: (req, res, next) => {
        let findOne = offers.data.filter(offer => offer.id === req.params.id);

        if (!findOne || findOne.length === 0) {
            res.status(404).send("Not Found");
        }

        const offer = {
            id: req.params.id,
            offeror : req.body.offeror,
            school : req.body.school,
            schoolClass : req.body.schoolClass,
            firstSchoolDay : req.body.firstSchoolDay,
            creationTime : req.body.creationTime
        };
        offers.data.delete(findOne);
        offers.data.push(offer);

        db.save(true);

        res.status(204);
        res.cookie("token", token, {maxAge: 86400})
        res.send();

        next();
    },
}

