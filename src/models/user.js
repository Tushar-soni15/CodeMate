const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unqiue: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email ID format is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 60
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photo: {
        type: String,
    },
    about: {
        type: String,
        default: "This is the default bio of the user"
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);;