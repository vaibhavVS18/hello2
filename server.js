const express = require("express");
const path = require("path");
const Tesseract = require("tesseract.js");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.post("/scan", express.json({ limit: "5mb" }), async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image provided" });

        const { data: { text } } = await Tesseract.recognize(image, "eng");
        const match = text.match(/\b\d{5}\b/); // Find a 5-digit number

        res.json({ text, foundNumber: match ? match[0] : null });
    } catch (error) {
        res.status(500).json({ error: "OCR failed", details: error.message });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
