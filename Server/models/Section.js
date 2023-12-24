// import mongoose for creating a schema
const mongoose = require('mongoose');

// Create and export the schema
const sectionSchema = new mongoose.Schema(
    {
        sectionName: {
            type: String,
        },
        subSection: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubSection",
                required: true,
            }
        ]
    }
)

module.exports = mongoose.model('Section', sectionSchema);