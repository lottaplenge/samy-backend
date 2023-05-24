const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    streetNumber:{
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    mail:{
        type: String,
        required: true,
    },
    postCode:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;