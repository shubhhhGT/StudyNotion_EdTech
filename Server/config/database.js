// Import mongoose to connect with DB
const mongoose = require('mongoose');

// Import dotenv to read from .env file
require('dotenv').config();

// Create and export a function to connect to DB
exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database Connected Successfully");
    }) .catch((error) => {
        console.log("Error connecting to Database!");
        console.error(error);
        process.exit(1);
    })
}