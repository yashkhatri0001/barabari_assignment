const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.ASSEMBLY_API_KEY;
const UPLOAD_URL = 'https://api.assemblyai.com/v2/upload';
const TRANSCRIPT_URL = 'https://api.assemblyai.com/v2/transcript';

exports.transcribeAudio = async (filePath) => {
  const audioData = fs.readFileSync(filePath);

  const uploadRes = await axios.post(UPLOAD_URL, audioData, {
    headers: {
      authorization: API_KEY,
      'content-type': 'application/octet-stream'
    }
  });

  const transcriptRes = await axios.post(TRANSCRIPT_URL, {
    audio_url: uploadRes.data.upload_url,
    word_boost: [],
    iab_categories: true,
    punctuate: true,
    format_text: true,
    speaker_labels: false
  }, {
    headers: { authorization: API_KEY }
  });

  const transcriptId = transcriptRes.data.id;

  // Poll until transcription completes
  let completed = false;
  let result;
  while (!completed) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const polling = await axios.get(`${TRANSCRIPT_URL}/${transcriptId}`, {
      headers: { authorization: API_KEY }
    });
    if (polling.data.status === 'completed') {
      completed = true;
      result = polling.data;
    } else if (polling.data.status === 'error') {
      throw new Error(polling.data.error);
    }
  }

  return {
    transcript: result.text,
    words: result.words,
    audio_duration_sec: result.audio_duration
  };
};
