const Pdf = require("../models/pdf");


const pdfUploadHandler = async (req, res) => {
    const file = req?.file;

    if (!file) {
        return res.status(400).json({ message: "No file attched." });
    }
    try {
        const fileUrl = `uploads/${file.filename}`;
        const title = file.originalname.split(".")[0];
        const pdfData = await Pdf.create({ fileUrl: fileUrl, userId: req.user.id, title });
        return res.status(201).json({ message: "Pdf uploaded successfully.", fileUrl, pdfId: pdfData._id });
    } catch (error) {
        console.log("upload pdf error", error);
        return res.status(500).json({ message: "Server Error, Failed to upload pdf." })
    }
}

const getPdfByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const pdfData = await Pdf.findById(id);
        return res.status(200).json({ message: "Pdf fetched successfully.", pdfData })
    } catch (error) {
        console.log("fetch pdf by id error", error);
        return res.status(500).json({ message: "Server Error, Failed to fetch pdf." })
    }
}

const getAllPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find({ userId: req.user.id });
        return res.status(200).json({ message: "Current user all pdf are fetched successfully.", pdfs })
    } catch (error) {
        console.log("get all pfs error", error);
        return res.status(500).json({ message: "Server Error, Failed to fetch all pdf." })
    }
}

const saveHighlights = async (req, res) => {
    const { id } = req.params
    try {
        const pdf = await Pdf.findOneAndUpdate(
            { _id: id },
            { $set: { highlights: req.body.highlights } },
            { new: true }
        );
        return res.status(201).json({ message: "Highlights save successfully." });
    } catch (error) {
        console.log("Highlights save error", error);
        return res.status(500).json({ message: "Server error, Failed to save highlights." })

    }
}

module.exports = {
    pdfUploadHandler,
    getPdfByIdHandler,
    getAllPdfs,
    saveHighlights
}