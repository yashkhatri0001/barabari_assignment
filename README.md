# Voice Evaluation Microservice

A Node.js microservice that processes spoken answers and provides structured feedback on pronunciation, pacing, and pauses using Deepgram STT.

---

## 🚀 Setup & Run Instructions

### 1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd barabari-assignment
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Variables**
Create a `.env` file in the project root with the following content:
```
DEEPGRAM_API_KEY=your_deepgram_api_key_here
MONGO_URI=mongodb://localhost:27017/your-db-name
PORT=3000
```
Replace with your actual Deepgram API key and MongoDB URI.

### 4. **Start MongoDB**
Make sure MongoDB is running locally or use a cloud MongoDB service.

### 5. **Run the Server**
```bash
node index.js
```
The server will start on `http://localhost:3000`.

---

## 🧪 API Usage

### **POST /transcribe**

- **Description:** Upload a `.wav` or `.mp3` audio file (≤ 60 seconds) for analysis.
- **Form field:** `audio`
- **Response:** JSON with transcript, word-level metadata, pronunciation, pacing, pause analysis, and feedback.

#### **Example cURL**
```bash
curl -X POST http://localhost:3000/transcribe \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@sample.wav"
```

---

## 🔊 Sample Audio Files Used

- `sample1.wav` — “Hello, my name is Arjun. I am an engineer.”
- `sample2.mp3` — “This is a test of the voice evaluation microservice.”
- *(Add your actual sample files or links to them here)*

---

## 📝 Assumptions and Notes

- The service uses **Deepgram** for speech-to-text and requires a valid API key.
- Only `.wav` and `.mp3` files up to 60 seconds are supported.
- Pronunciation is evaluated using Deepgram’s word confidence scores (threshold: 0.85).
- Pacing feedback:  
  - WPM < 90 → “Too slow”  
  - WPM > 150 → “Too fast”  
  - Otherwise, “appropriate”
- Pauses longer than 0.5 seconds are counted and analyzed.
- All results are stored in MongoDB for future retrieval.
- The microservice is stateless except for database storage.
- For demo/testing, use the provided sample audio files.

---

## 📬 Contact

For questions or issues, please open an issue on this repository.
