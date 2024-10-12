const mongoose = require("mongoose")

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://tshr:2lKAP7RXWq7xrZcD@namastenode.g2hyk.mongodb.net/codeMate")
};

module.exports = connectDB