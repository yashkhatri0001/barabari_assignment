const fs = require('fs');
const { createClient } = require('@deepgram/sdk');
require('dotenv').config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
const deepgram = createClient(deepgramApiKey);

exports.transcribeAudio = async (filePath) => {
  const audio = fs.readFileSync(filePath);
  const mimetype = filePath.endsWith('.mp3') ? 'audio/mp3' : 'audio/wav';

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    audio,
    {
      mimetype,
      model: 'general',
      smart_format: true,
      punctuate: true,
      language: 'en-US',
    }
  );

  if (error) {
    throw new Error(error.message || 'Deepgram transcription failed');
  }

  const alt = result.results.channels[0].alternatives[0];
  const transcript = alt.transcript;
  const words = (alt.words || []).map((word) => ({
    word: word.word,
    start: word.start,
    end: word.end,
    confidence: word.confidence,
  }));
  const audio_duration_sec = result.metadata.duration;

  return {
    transcript,
    words,
    audio_duration_sec,
  };
};