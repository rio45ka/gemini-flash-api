# Kawan Belajar AI

Kawan Belajar AI adalah chatbot berbasis Gemini untuk membantu pengguna belajar dalam bahasa Indonesia. Use case utama project ini adalah **education bot / personal tutor** yang dapat menyesuaikan gaya jawaban berdasarkan konfigurasi pengguna.

## Fitur

- Chatbot AI menggunakan model `gemini-2.5-flash`
- Web chat interface dari folder `public`
- Endpoint API `POST /api/chat`
- Konfigurasi kreatif:
  - Gaya bahasa: mentor, santai, formal
  - Level pengguna: pemula, menengah, lanjut
  - Fokus materi: umum, programming, matematika, bahasa Inggris, produktivitas
  - Target belajar pengguna
  - Memory lokal untuk preferensi belajar
- Quick prompt untuk rencana belajar, penjelasan konsep, dan debugging kode
- Pengaturan pengguna tersimpan di `localStorage`

## Tech Stack

- Node.js
- Express
- Google Gen AI SDK
- dotenv
- HTML, CSS, JavaScript

## Struktur Folder

```text
gemini-chatbot-api/
├── index.js
├── package.json
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Instalasi

Masuk ke folder project:

```bash
cd gemini-chatbot-api
```

Install dependencies:

```bash
npm install
```

Buat file `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Menjalankan Project

Jalankan server:

```bash
node index.js
```

Buka web chatbot:

```text
http://localhost:3000
```

## API Endpoint

### Chat

```http
POST /api/chat
Content-Type: application/json
```

Request body:

```json
{
  "conversation": [
    {
      "role": "user",
      "text": "Jelaskan konsep variable di JavaScript untuk pemula."
    }
  ],
  "settings": {
    "tone": "mentor",
    "level": "pemula",
    "focus": "programming",
    "goal": "Paham dasar JavaScript",
    "memory": "Saya baru belajar coding dan suka contoh sederhana."
  }
}
```

Response sukses:

```json
{
  "result": "Jawaban dari Gemini..."
}
```

Response error:

```json
{
  "message": "Error message"
}
```

## Konfigurasi Parameter

### `tone`

Mengatur gaya bahasa dan temperature model.

```text
mentor = hangat, jelas, memotivasi
santai = santai dan suportif
formal = rapi dan profesional
```

### `level`

Mengatur kedalaman penjelasan.

```text
pemula = analogi sederhana dan minim jargon
menengah = praktis dengan contoh
lanjut = lebih teknis dan mendalam
```

### `focus`

Mengatur domain jawaban chatbot.

```text
umum
programming
matematika
english
produktivitas
```

### `goal`

Target belajar pengguna, misalnya:

```text
Paham dasar JavaScript dalam 7 hari
```

### `memory`

Preferensi atau konteks pengguna yang dikirim ke model, misalnya:

```text
Saya suka penjelasan singkat, contoh visual, dan latihan kecil.
```

## Catatan

- Chatbot diarahkan untuk selalu menjawab dalam bahasa Indonesia.
- Memory disimpan di browser menggunakan `localStorage`, bukan database.
- File `.env`, `node_modules/`, dan `package-lock.json` diabaikan oleh git melalui `.gitignore` root project.
