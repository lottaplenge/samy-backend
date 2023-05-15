const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    streetNumber:{
        type: Number,
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
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;