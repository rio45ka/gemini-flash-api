import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(express.json());

const PORT = 3000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Endpoint to generate text based on a prompt
app.post('/generate-text', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log('Error generating text:', error);
        res.status(500).json({ message: `${error.message}` });
    }
});


// Endpoint to generate content based on a prompt and an image
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { type: 'text', text: prompt },
                { inlineData: { data: base64Image, mimeType: req.file.mimetype } },
            ],
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log('Error generating image:', error);
        res.status(500).json({ message: `${error.message}` });
    }
});

// Endpoint to generate content based on a prompt and an document
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { type: 'text', text: prompt },
                { inlineData: { data: base64Document, mimeType: req.file.mimetype } },
            ],
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log('Error generating image:', error);
        res.status(500).json({ message: `${error.message}` });
    }
});

// Endpoint to generate content based on a prompt and an audio
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { type: 'text', text: prompt ?? "Please create a transcript of the audio." },
                { inlineData: { data: base64Audio, mimeType: req.file.mimetype } },
            ],
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log('Error generating image:', error);
        res.status(500).json({ message: `${error.message}` });
    }
});