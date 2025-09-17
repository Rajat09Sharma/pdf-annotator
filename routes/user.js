const express = require("express");
const { pdfUploadHandler, getPdfByIdHandler, getAllPdfs, saveHighlights } = require("../controllers/user");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/pdf/upload", authMiddleware, upload.single("file"), pdfUploadHandler);
router.get("/pdfs", authMiddleware, getAllPdfs);
router.get("/pdf/:id", authMiddleware, getPdfByIdHandler);
router.put("/pdf/edit/:id", authMiddleware, saveHighlights);


module.exports = router;