const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const { validateAndEditData } = require("../helper/validate");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR", err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateAndEditData(req)){
            throw new Error("You cannot edit these fields")
        }

        const loggedInUser = req.user;
        console.log(loggedInUser); // before

        Object.keys(req.body).forEach((item) => (loggedInUser[item] = req.body[item]));
        console.log(loggedInUser); // after

        await loggedInUser.save() // to save the data in the database

        res.send("user data updated")
    }catch (err) {

    }
});

profileRouter.patch("/profile/forgot-password", userAuth, async (req, res) => {
    try{
        const { passwordNew } = req.body;

         const user = req.user;

         console.log(user);
        // encrypting the new password
         const passwordHash = await bcrypt.hash(passwordNew, 10)
         console.log(passwordHash);
        // adding the new hased password to the user model instance
         user.password = passwordHash;
        // saving the new model instaance to the DB.
         user.save();
        // checking before and after data of the user
         console.log(user);
         // sending the response
         res.send("Password updated successfully");
    }catch (err) {

    }
})

module.exports = profileRouter;