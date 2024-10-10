const express = require('express');
const { adminAuth } = require('./middlewares/auth');
const app = express();

// app.use("/", (req, res, next) => {
//     // res.send("Handling / route");
//     next();
// })

// // request handlers (order matters)
// app.get("/home", 
//     (req, res, next) => {
//         //route handler or middleware depends on if the respond is sent or not.
//         // res.send("You just landed on the home page.");
//         next();
//     },
//     (req, res, next) => {
//         res.send("This is the second response");
//     });

// app.post("/", (req, res) => {
//     res.send("Hello from the server.");
// });

// check the authorization of the user thr middleware:

app.use("/admin", adminAuth)

app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent")
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted a user")
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 3000");
});
