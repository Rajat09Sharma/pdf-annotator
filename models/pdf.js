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
  highlights: [
    {
      highlightId: { type: String, required: true }, // your random string ID
      pdfId: { type: mongoose.Schema.Types.ObjectId, ref: "Pdf" }, // optional
      content: { type: mongoose.Schema.Types.Mixed, required: true }, // text/object from pdf-highlighter
      position: {
        pageNumber: { type: Number, required: true },
        boundingRect: {
          x1: Number,
          y1: Number,
          x2: Number,
          y2: Number,
          width: Number,
          height: Number,
        },
        rects: [
          {
            x1: Number,
            y1: Number,
            x2: Number,
            y2: Number,
            width: Number,
            height: Number,
          },
        ],
      },
      comment: {
        type: mongoose.Schema.Types.Mixed, // can be {text, emoji} or just text
      },
      timestamp: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

const Pdf = mongoose.model("Pdf", pdfSchema);
module.exports = Pdf;
