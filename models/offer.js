const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    offeror: {
        type: String,
        required: true,
    },
    offerorId:{
        type: String,
        required: false,
    },
    school: {
        type: String,
        required: true,
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