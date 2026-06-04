const express = require("express");
const router = express.Router();
const multer = require("multer");
const { bucket } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

// Memory storage engine configuration for Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

router.post("/product-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Please attach an image asset file." });
        }

        // Assign unique file names to avoid storage overwrite issues
        const blob = bucket.file(`products/${uuidv4()}_${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: { contentType: req.file.mimetype },
            resumable: false
        });

        blobStream.on("error", (err) => {
            console.error("Firebase storage channel stream failed:", err);
            return res.status(500).json({ error: "Storage upload failed." });
        });

        blobStream.on("finish", async () => {
            // Long term public access URL configuration
            const [url] = await blob.getSignedUrl({
                action: "read",
                expires: "01-01-2076"
            });

            return res.status(200).json({
                message: "Image uploaded successfully",
                imageUrl: url
            });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error("Upload handler caught error:", error);
        res.status(500).json({ error: "Internal server asset management crash." });
    }
});

module.exports = router;