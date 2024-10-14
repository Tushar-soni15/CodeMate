// check the authorization of the user thr middleware:
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // read the token from the req cookie
        const cookies = req.cookies

        const {token} = cookies; 

        if(!token){
            throw new Error("Invalid token ")
        }
        // validate the token
        const decodedMessage = await jwt.verify(token, "CodeMate@15");
        // Find the user
        const {_id} = decodedMessage;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found")
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("Opps something went wrong")
    }
}

module.exports = {
    userAuth
}