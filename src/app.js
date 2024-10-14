const express = require('express');
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser")

// MIDDLEWARE given by express js
app.use(express.json()); // this converts the javascript oject to JSON. This is request parsing which can be gracefully done using the middleware.
app.use(cookieParser());

const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
