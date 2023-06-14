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
    },

    addMany: (req, res) => {
        const schools = req.body;
        let addCount = 0;
        for(let i = 0; i < schools.length; i++){
            const school = new School({
                schoolType: schools[i].schoolType,
                privateSchool: schools[i].privateSchool,
                schoolName: schools[i].schoolName,
                street: schools[i].address['street'],
                postCode: schools[i].address['postCode'],
                city: schools[i].address['city'],
                website: schools[i].website,
                phone : schools[i].phone,
                languages: schools[i].languages,
            });

            school.save()
                .then(result => {
                    addCount++;
                    console.log("success");
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        const message = `${addCount} schools added`;
        res.status(201).json({message: message});
    }
}