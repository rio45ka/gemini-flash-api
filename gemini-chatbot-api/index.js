import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = 'gemini-2.5-flash';
const TONE_OPTIONS = {
    santai: {
        label: 'santai dan suportif',
        temperature: 0.8,
    },
    formal: {
        label: 'formal, rapi, dan profesional',
        temperature: 0.55,
    },
    mentor: {
        label: 'seperti mentor belajar yang hangat, jelas, dan memotivasi',
        temperature: 0.7,
    },
};

const LEVEL_OPTIONS = {
    pemula: 'pemula, gunakan analogi sederhana dan hindari jargon berlebihan',
    menengah: 'menengah, beri penjelasan praktis dengan contoh',
    lanjut: 'lanjut, boleh memakai istilah teknis dan pembahasan lebih mendalam',
};

const FOCUS_OPTIONS = {
    umum: 'belajar umum',
    programming: 'pemrograman dan logika coding',
    matematika: 'matematika dan pemecahan soal',
    english: 'bahasa Inggris',
    produktivitas: 'produktivitas belajar dan manajemen waktu',
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

function pickOption(options, value, fallback) {
    return Object.hasOwn(options, value) ? options[value] : options[fallback];
}

function buildSystemInstruction(settings = {}) {
    const tone = pickOption(TONE_OPTIONS, settings.tone, 'mentor');
    const level = pickOption(LEVEL_OPTIONS, settings.level, 'pemula');
    const focus = pickOption(FOCUS_OPTIONS, settings.focus, 'umum');
    const goal = typeof settings.goal === 'string' && settings.goal.trim()
        ? settings.goal.trim().slice(0, 300)
        : 'membantu pengguna memahami materi dan menentukan langkah belajar berikutnya';
    const memory = typeof settings.memory === 'string' && settings.memory.trim()
        ? settings.memory.trim().slice(0, 700)
        : 'Tidak ada memory khusus dari pengguna.';

    return `
Kamu adalah Kawan Belajar AI, chatbot tutor personal untuk pelajar Indonesia.
Use case utama: membantu pengguna belajar, memahami materi, merangkum konsep, latihan soal, debugging sederhana, dan menyusun rencana belajar.
Jawab hanya menggunakan bahasa Indonesia.
Gaya bahasa: ${tone.label}.
Level pengguna: ${level}.
Fokus domain saat ini: ${focus}.
Tujuan belajar pengguna: ${goal}.
Memory pengguna: ${memory}.

Aturan jawaban:
- Berikan jawaban yang relevan, akurat, dan mudah dipraktikkan.
- Jika pertanyaan ambigu, buat asumsi singkat lalu jawab.
- Jika cocok, gunakan format: Inti Jawaban, Penjelasan, Contoh, Langkah Berikutnya.
- Akhiri dengan satu rekomendasi belajar atau pertanyaan lanjutan yang membantu.
- Jangan mengarang fakta jika tidak yakin; sebutkan keterbatasannya dengan jujur.
`.trim();
}

// Endpoint to generate text based on a prompt
app.post('/api/chat', async (req, res) => {
    const { conversation, settings } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: pickOption(TONE_OPTIONS, settings?.tone, 'mentor').temperature,
                systemInstruction: buildSystemInstruction(settings),
            }
        });
        res.status(200).json({ result: response.text });   
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ message: `${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
