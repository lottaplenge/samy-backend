const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    schoolType:{
        type: String,
        required: true,
    },
    privateSchool:{
        type: String,
        required: true,
    },
    schoolName: {
        type: String,
        required: true,
    },
    street:{
        type: String,
        required: true,
    },
    postCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    languages: {
        type: [String],
        required: false,
    }
});

const School = mongoose.model('School', schoolSchema);
module.exports = School;