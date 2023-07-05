const Offer = require('../models/offer');
const {logError} = require('../utils/logging');


module.exports = {
    create: (req, res, next) => {

        const offerMongo = new Offer({
            offeror: req.body.offeror,
            school: req.body.school,
            schoolClass: req.body.schoolClass,
            firstSchoolDay: req.body.firstSchoolDay,
        });

        offerMongo.save()
            .then((result) => {
                if(!result || result.length === 0){
                    res.status(422).send("Unable to process!");
                }else{
                    res.send(result);
                    next();
                }
            })
            .catch((err) => {
                logError(err);
                res.status(500).send(err);
            });
    },

    list: (req, res) => {
        Offer.find()
            .then((result) => {
                if(!result || result.length === 0){
                    res.send([]);
                }else{
                    res.send(result);
                }
            })
            .catch((err) => {
                res.status(500).send(err);
                logError(err);
            })
    },

    findSingle: (req, res) => {
        Offer.findById(req.params.id)
            .then((result) => {
                if(!result || result.length === 0){
                    res.status(404).send("Not Found");
                }else{
                    res.send(result);
                }
            })
            .catch((err) => {
                logError(err);
                res.status(500).send(err);
            })

    },

    delete: (req, res) => {

        Offer.findByIdAndDelete(req.params.id)
            .then((result) => {
                if(!result || result.length === 0){
                    res.status(404).send("Not Found");
                }else{
                    res.status(200).json({
                        msg: "Offer deleted!",
                    });
                }
            })
            .catch((err) => {
                logError(err);
                res.status(500).send(err);
            })
    },

    update: (req, res) => {

        Offer.findByIdAndUpdate(req.params.id, {
            $set: {
                offeror : req.body.offeror,
                school : req.body.school,
                schoolClass : req.body.schoolClass,
                firstSchoolDay : req.body.firstSchoolDay,
            }
        }, {new: true})
            .then((result) => {
                if(!result || result.length === 0){
                    res.status(404).send("Not Found");
                }else{
                    res.status(200).send(result);
                }
            })
            .catch((err) => {
                logError(err);
                res.status(500).send(err);
            })
    },
}

