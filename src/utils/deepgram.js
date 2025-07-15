const fs = require('fs');
const { Deepgram } = require('@deepgram/sdk');
require('dotenv').config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
const deepgram = new Deepgram(deepgramApiKey);

exports.transcribeAudio = async (filePath) => {
  const audio = fs.readFileSync(filePath);
  const mimetype = filePath.endsWith('.mp3') ? 'audio/mp3' : 'audio/wav';

  const response = await deepgram.transcription.preRecorded({ buffer: audio, mimetype }, {
    punctuate: true,
    diarize: false,
    utterances: false,
    smart_format: true,
    language: 'en-US',
    model: 'general',
    // Add more Deepgram options if needed
  });

  if (!response || !response.results || !response.results.channels || !response.results.channels[0].alternatives[0]) {
    throw new Error('Deepgram transcription failed');
  }

  const alt = response.results.channels[0].alternatives[0];
  const transcript = alt.transcript;
  const words = (alt.words || []).map(word => ({
    word: word.word,
    start: word.start,
    end: word.end,
    confidence: word.confidence
  }));
  const audio_duration_sec = response.metadata.duration;

  return {
    transcript,
    words,
    audio_duration_sec
  };
}; 