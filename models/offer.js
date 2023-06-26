const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    offerorId:{
        type: String,
        required: false,
    },
    schoolId:{
        type: String,
        required: false,
    },
    schoolClass:{
        type: Number,
        required: true,
    },
    firstSchoolDay:{
        type: String,
        required: true,
    },

}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;