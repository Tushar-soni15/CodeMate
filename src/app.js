const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")

// MIDDLEWARE given by express js
app.use(express.json()); // this converts the javascript oject to JSON. This is request parsing which can be gracefully done using the middleware.

//POST api call to save the data to DB
app.post("/signup", async (req, res) => {
    console.log(req.body)
    // create an instance of the User model
    const user = new User(req.body)

    try {
        await user.save();
        res.send("User added successfully")
    }
    catch(err) {
        console.log("ERROR", err.message)
        res.status(400).send("Error saving the user info")
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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId
    // console.log("User ID:", userId);
    const data = req.body
    // console.log(data)
    try{
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
