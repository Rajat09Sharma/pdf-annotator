const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String
    },
    highlights: {
        type: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pdf"
            },
            content: {
                type: String
            },
            position: {
                type: String
            },
            comment: {
                type: String
            }
        }]
    }
}, { timestamps: true });

const Pdf = mongoose.model("Pdf", pdfSchema);
module.exports = Pdf;
