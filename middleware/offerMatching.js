const School = require('../models/school');
const Offer = require('../models/offer');
const User = require('../models/user');

module.exports = {
    getAllMatches: (req, res, next) => {
        const userId = req.params.userId;

        Offer.find({offerorId : userId})
            .then(result => {
                console.log(result);
                let schoolIDs = [];
                for(let i = 0;  i < result.length; i++){
                    schoolIDs.append(result[i].schoolId);
                    console.log(schoolIDs);
                    res.json({message: schoolIDs}).send();
                }
            })
    }
}