const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const { validateSignUp } = require('./helper/validate');
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");

// MIDDLEWARE given by express js
app.use(express.json()); // this converts the javascript oject to JSON. This is request parsing which can be gracefully done using the middleware.
app.use(cookieParser());
//POST api call to save the data to DB
app.post("/signup", async (req, res) => {
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
})

//Login API

app.post("/login", async (req, res) => {
    try{
    const {email, password} = req.body

    //creating an instance of User for finding the email in the DB. If it exists or not.
    const user = await User.findOne({email: email})
    if (!user) {
        throw new Error("Invalid Credentials") 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid){

        // Create A JWT token
        const token = await jwt.sign({_id: user._id}, "CodeMate@15");
        console.log(token);

        // add the jwt token into a cookie and send the response back to the user
        res.cookie("token", token)

        res.send("Login Successfull")
    } else {
        throw new Error("Invalid Credentials")
    }
    }catch(err){
        console.log("ERROR", err.message)
        res.status(400).send("Error Loggin you in")
    }
    
})

// GET api to get one user by the emailID:
app.get("/user", async (req, res) => {
    const userEmail = req.body.email
    try{
        const user = await User.find({email: userEmail})
        res.send(user);
        if(!user){
            res.send(404).send("user not found")
        }
    } catch (err){
        res.status(400).send("Something went wrong")
    }
});

// GET api to get all the data in a collection (user table)
app.get("/feed", async (req, res) => {
    const user = await User.find({})
    try{
        res.send(user)
    } catch(err){
        res.status(400).send("Something went wrong")
    }
})

// DELETE the user by its ID
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
        const deletedUser = await User.findByIdAndDelete(userId)
        res.send("deleted the user successfully")
    }catch(err){
        res.status(400).send("Something went wrong")
    }
});

//UPDATE the user by the ID - find the difference between patch and put
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    // console.log("User ID:", userId);
    const data = req.body
    // console.log(data)

    try{
        const ALLOWED_UPDATES = ["photo", "about", "gender", "age"]

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed){
            throw new Error("Field cannot be updated")
        }

        const updatedUser = await User.findByIdAndUpdate(userId, data, {returnDocument: "after", runValidators: true, upsert: false});

        // console.log("Updated User:", updatedUser);

        res.send("User info updated !!")
    }catch(err){
        console.error("Update Error:", err);
        res.status(400).send("Something went wrong while updating the user")
    }
})

connectDB()
    .then(()=>{
        console.log("connection estabilished");
        app.listen(3005, () => {
            console.log("Server is successfully listening on port 3003");
        });
    }
    ).catch(()=>{
    console.log("Error connecting the DB")
    });
