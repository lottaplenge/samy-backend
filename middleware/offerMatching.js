const School = require('../models/school');
const Offer = require('../models/offer');
const User = require('../models/user');

module.exports = {
    getUserOffers: (req, res, next) => {
        const offerorId = req.params.userId;
        console.log(offerorId)
        Offer.find({offerorId})
            .then(result => {
                let schoolIds = [];
                let schoolClasses = [];
                for(let i = 0;  i < result.length; i++){
                    schoolIds.push(result[i].schoolId);
                    schoolClasses.push(result[i].schoolClass);
                }
                School.find({'_id': { $in: schoolIds}})
                    .then(result => {
                        let schoolTypes = [];
                        let privateSchoolValues = [];
                        for(let i = 0; i < result.length; i++){
                            schoolTypes.push(result[i].schoolType);
                            privateSchoolValues.push(result[i].privateSchool);
                        }
                        let userOffers  = {
                            schoolIds: schoolIds,
                            schoolClasses: schoolClasses,
                            schoolTypes: schoolTypes,
                            privateSchoolValues: privateSchoolValues
                        };
                        req.userOffers = userOffers;
                        next();
                    })
            })
    },

    getMatchingOffers: (req, res, next) => {
        const userOffers = req.userOffers;
        console.log(userOffers);
        res.send();
    }
}