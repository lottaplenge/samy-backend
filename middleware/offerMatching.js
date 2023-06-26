const School = require('../models/school');
const Offer = require('../models/offer');
const User = require('../models/user');
const axios = require('axios');

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

    // enrich matched offers with information about school
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
    req.matchedOffers = detailedMatchingOffers;
    next();
}

// function uses mapbox api to calculate the car driving distance between the user and the school in offer
async function calculateSchoolDistance(req, res, next){
    let matchedOffers = req.matchedOffers;

    const user = await User.findById(req.params.userId)
        .then(result => {
            return result;
        })

    // get User address and address coordinates
    const userAddress = `${user.street} ${user.streetNumber}, ${user.city}, Germany`;
    const userCoordinates = await getAddressCoordinates(userAddress);

    // start variable for mapbox api
    const start = `${userCoordinates.lng},${userCoordinates.lat}`;

    // mapbox routing api url and api key
    const apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const apiKey = '5b3ce3597851110001cf6248b000473fa0b34a81bdcdb7e1b204b397';

    // iterate through matched offers to calculate distance btw school and user
    for(let userOfferKey in matchedOffers){
        for(let matchedOfferKey in matchedOffers[userOfferKey]){
            const schoolAddress = `${matchedOffers[userOfferKey][matchedOfferKey].address.street}, ${matchedOffers[userOfferKey][matchedOfferKey].address.city}, Germany`;

            // calculate school coordinates
            const schoolCoordinates = await getAddressCoordinates(schoolAddress);

            // end variable for mapbox api
            const end = `${schoolCoordinates.lng},${schoolCoordinates.lat}`;

            // call to mapbox api and get car driving distance and duration in "distance" object
            const distance = await axios.get(apiUrl, {
                params: {
                    api_key: apiKey,
                    start: start,
                    end: end
                }
            })
                .then(response =>{
                    return {
                        distance: response.data.features[0].properties.segments[0].distance,
                        duration: response.data.features[0].properties.segments[0].duration
                    }
                })
                .catch(err =>{
                    console.log(err);
                })

            // add distance to respective matched offer
            matchedOffers[userOfferKey][matchedOfferKey]['distance'] = distance;
        }
    }
    res.send(matchedOffers);
}

// helper function to calculate the coordinates of an address
async function getAddressCoordinates(address){
    const apiUrl = 'https://api.openrouteservice.org/geocode/search';
    const apiKey = '5b3ce3597851110001cf6248b000473fa0b34a81bdcdb7e1b204b397';

    const latLng = await axios.get(apiUrl, {
        params: {
            api_key: apiKey,
            text: address,
        }
    })
        .then(response =>{
            return {lat: response.data.bbox[1], lng: response.data.bbox[0]}

        })
        .catch(err =>{
            console.log(err);
        })
    return latLng;
}