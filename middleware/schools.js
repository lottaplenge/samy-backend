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
    }
}