const School = require('../models/school');

module.exports = {
    list: (req, res) => {
        School.find()
            .then(result => {
                res.status(200).send(result);
            })
            .catch(err => {
                console.error(err);
            });
    },

    findOne: (req, res) => {
        School.findById(req.params.id)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(err => {
                console.error(err);
            });
    },

    addOne: (req, res) => {
        const school = new School({
            schoolType: req.body.schoolType,
            privateSchool: req.body.privateSchool,
            schoolName: req.body.schoolName,
            street: req.body.address['street'],
            postCode: req.body.address['postCode'],
            city: req.body.address['city'],
            website: req.body.website,
            phone : req.body.phone,
            languages: req.body.languages,
        });

        school.save()
            .then(result => {
                res.status(201).send(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            })
    }
}