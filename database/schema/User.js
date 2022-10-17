const mongoose = require('mongoose');
const validator = require('validator')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value === ('password')) {
                throw new Error('enter different password');
            }

        }
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
        minlength: 10,

        }
})



const User =mongoose.model('User',UserSchema);

module.exports = User;