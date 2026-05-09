# Gemini Flash API

A small Express API for generating text and multimodal responses with Google's Gemini Flash model.

## Features

- Generate text from a prompt
- Generate responses from an image and prompt
- Generate responses from a document and prompt
- Generate audio transcripts or audio-based responses

## Tech Stack

- Node.js
- Express
- Multer
- Google Gen AI SDK
- dotenv

## Requirements

- Node.js 18 or newer
- npm
- Gemini API key

## Installation

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Running The Server

Start the API:

```bash
node index.js
```

The server runs on:

```text
http://localhost:3000
```

## API Endpoints

### Generate Text

Generates text from a prompt.

```http
POST /generate-text
Content-Type: application/json
```

Request body:

```json
{
  "prompt": "Explain how artificial intelligence works in simple terms."
}
```

Example:

```bash
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Explain how artificial intelligence works in simple terms."}'
```

### Generate From Image

Generates a response from an uploaded image and prompt.

```http
POST /generate-from-image
Content-Type: multipart/form-data
```

Form fields:

- `prompt`: text prompt
- `image`: image file

Example:

```bash
curl -X POST http://localhost:3000/generate-from-image \
  -F "prompt=Describe this image." \
  -F "image=@/path/to/image.jpg"
```

### Generate From Document

Generates a response from an uploaded document and prompt.

```http
POST /generate-from-document
Content-Type: multipart/form-data
```

Form fields:

- `prompt`: text prompt
- `document`: document file

Example:

```bash
curl -X POST http://localhost:3000/generate-from-document \
  -F "prompt=Summarize this document." \
  -F "document=@/path/to/document.pdf"
```

### Generate From Audio

Generates a response from an uploaded audio file. If no prompt is provided, the API asks Gemini to create a transcript.

```http
POST /generate-from-audio
Content-Type: multipart/form-data
```

Form fields:

- `prompt`: optional text prompt
- `audio`: audio file

Example:

```bash
curl -X POST http://localhost:3000/generate-from-audio \
  -F "prompt=Create a transcript of this audio." \
  -F "audio=@/path/to/audio.mp3"
```

## Response Format

Successful responses return:

```json
{
  "result": "Generated response text"
}
```

Error responses return:

```json
{
  "message": "Error message"
}
```

## Project Structure

```text
.
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## Notes

- The API currently uses the `gemini-2.5-flash` model.
- Uploaded files are handled in memory by Multer and are not saved to disk by these endpoints.
