// import mongoose for creating a schema
const mongoose = require('mongoose');

// Create and export the schema
const profileSchema = new mongoose.Schema(
    {
        gender: {
            type: String,
        },
        dateOfBirth: {
            type: String,
        },
        about: {
            type: String,
            trim: true,
        },
        contactNumber: {
            type: Number,
            trim: true,
        }
    }
)
    
module.exports = mongoose.model('Profile', profileSchema);