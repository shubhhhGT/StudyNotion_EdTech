// import mongoose for creating a schema
const mongoose = require('mongoose');

// Create and export the schema
const subSectionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        timeDuration: {
            type: String,
        },
        description: {
            type: String,
        },
        videoUrl: {
            type: String,
        }
    }
)

module.exports = mongoose.model('SubSection', subSectionSchema);