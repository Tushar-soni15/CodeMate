const express = require("express")
const authRouter = express.Router();
const { validateSignUp } = require('../helper/validate');
const bcrypt = require("bcrypt");
const User = require("../models/user");

//POST api call to save the data to DB
authRouter.post("/signup", async (req, res) => {
    // the schema level validator can be enough but we can explicitely go one step further to validate the data sent by the user.
    // to get that validation - the best practice is to have a seperate file to write all the validations - these validator functions are also known as the helper functions. 

    const {firstName, lastName, email, password} = req.body
    try {
        validateSignUp(req);

        console.log(req.body) // cannot be trusted

        // Encrypt the password:

        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash);

        // create an instance of the User model with the required fields only.
        const user = new User({firstName, lastName, email, password: passwordHash})
        await user.save();
        res.send("User added successfully")
    }
    catch(err) {
        console.log("ERROR", err.message)
        res.status(400).send("Error saving the user info")
    }
});

authRouter.post("/login", async (req, res) => {
    try{
    const {email, password} = req.body

    //creating an instance of User for finding the email in the DB. If it exists or not.
    const user = await User.findOne({email: email})
    if (!user) {
        throw new Error("Invalid Credentials") 
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid){

        // Create A JWT token
        const token = await user.getJWT();

        // add the jwt token into a cookie and send the response back to the user
        res.cookie("token", token);

        res.send("Login Successfull")
    } else {
        throw new Error("Invalid Credentials")
    }
    }catch(err){
        console.log("ERROR", err.message)
        res.status(400).send("Error Loggin you in")
    }
    
});

authRouter.post("/logout", async (req, res) => {
    try{
        res.cookie("token", null);
        res.send("You have been logged out");
    }catch(err){
        console.log("ERROR", err.message)
        res.status(400).send("Error Loggin you out")
    }
});

module.exports = authRouter;