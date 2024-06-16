const mongoose = require('mongoose')
const db = mongoose.connection;

const uri = process.env.DB_URI;

mongoose
    .connect(uri)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    })

db.on("open", () => {
    console.log("Database is open");
});

db.on("error", (err) => {
    console.log(err);
});

db.on("close", () => {
    console.log("Database is closing...");
});