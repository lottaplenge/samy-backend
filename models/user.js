const mongoose = require('mongoose');
const argon2 = require('argon2');
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

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const hashedPassword = await argon2.hash(this.password);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Verify the password against the hashed password
userSchema.methods.verifyPassword = async function (password) {
    try {
        return await argon2.verify(this.password, password);
    } catch (error) {
        return false;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;