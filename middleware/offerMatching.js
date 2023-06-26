const School = require('../models/school');
const Offer = require('../models/offer');
const User = require('../models/user');

module.exports = {
    getUserOffers: (req, res, next) => {
        const offerorId = req.params.userId;
        const offerParams = {};
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
                            offerParams[i] = {
                                schoolId: schoolIds[i],
                                schoolClass: schoolClasses[i],
                                schoolType: result[i].schoolType,
                                privateSchool: result[i].privateSchool,
                            };
                        }
                        req.userOffers = offerParams;
                        next();
                    })
            })
    },
    getMatchingOffers,
    calculateSchoolDistance,

}

async function getMatchingOffers(req, res, next) {
    const userOffers = req.userOffers;
    const userId = req.params.userId;

    // get All available offers
    const allOffers =  await Offer.find()
    .then(result => {
        return result
    })

    // retrieve additional Information for offers needed for the matching
    let schoolInfo = {};
    for(let i = 0; i < allOffers.length; i++){
        const schoolDetails = await School.findById(allOffers[i].schoolId)
            .then(result => {
                return {
                    schoolName: result.schoolName,
                    schoolType: result.schoolType,
                    privateSchool: result.privateSchool,
                    address: {
                        street: result.street,
                        postCode: result.postCode,
                        city: result.city,
                    }
                };
            })
        schoolInfo[allOffers[i].schoolId] = schoolDetails;
    }
    // iterate through user offers and match from all Offers
    const matchingOffers = {}
    for(let key in userOffers){
        const userOffer = userOffers[key];
        matchingOffers[key] = allOffers.filter(obj => {
            return obj.offerorId != userId
                && obj.schoolId != userOffer.schoolId
                && schoolInfo[obj.schoolId].schoolType === userOffers[key].schoolType
                && obj.schoolClass === userOffers[key].schoolClass
                && schoolInfo[obj.schoolId].privateSchool === userOffers[key].privateSchool
        })
    }
    let detailedMatchingOffers = {};
    for(let key in matchingOffers){
        let detailedMatchingOffer = {}
       for(let i = 0; i < matchingOffers[key].length; i++){
            detailedMatchingOffer[i] = {
                offerId: matchingOffers[key][i]._id,
                offerorId: matchingOffers[key][i].offerorId,
                schoolId: matchingOffers[key][i].schoolId,
                schoolClass: matchingOffers[key][i].schoolClass,
                firstSchoolDay: matchingOffers[key][i].firstSchoolDay,
                schoolName: schoolInfo[matchingOffers[key][i].schoolId].schoolName,
                schoolType: schoolInfo[matchingOffers[key][i].schoolId].schoolType,
                privateSchool: schoolInfo[matchingOffers[key][i].schoolId].privateSchool,
                address: schoolInfo[matchingOffers[key][i].schoolId].address,
                createdAt: matchingOffers[key][i].createdAt,
                updatedAt: matchingOffers[key][i].updatedAt,
           }
       }
       detailedMatchingOffers[key] = detailedMatchingOffer;
    }
    next();
}

async function calculateSchoolDistance(res, req, next){

}