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
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: false,
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