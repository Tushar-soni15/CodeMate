const validator = require("validator")

const validateSignUp = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("The Name is required. Please enter the First Name and Last Name to get yourself Registered")
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First Name should be minimun 4 characters and maximum 50 characters")
    } else if (!validator.isEmail(email)) {
        throw new Error("Email Id format is not valid")
    } else if (!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough - it must contain one capital letter, one small letter and a Number.")
    }
};

const validateAndEditData = (req) => {
    const allowedEditFiles = ["firstName", "lastName", "about", "skills", "gender", "age"];

    const isEditAllowed = Object.keys(req.body).every((item) => allowedEditFiles.includes(item)); 

    return isEditAllowed;
}

module.exports = {
    validateSignUp,
    validateAndEditData
}