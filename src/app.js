const express = require('express');
const app = express();

// request handlers
app.get("/", (req, res) => {
    res.send("Hello from the server.");
});

app.get("/home", (req, res) => {
    res.send("You just landed on the home page.");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});
