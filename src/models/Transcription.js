const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: String,
  start: Number,
  end: Number,
  confidence: Number
});

const mispronouncedSchema = new mongoose.Schema({
  word: String,
  start: Number,
  confidence: Number
});

const transcriptionSchema = new mongoose.Schema({
  transcript: String,
  words: [wordSchema],
  audio_duration_sec: Number,

  pronunciation_score: Number,
  mispronounced_words: [mispronouncedSchema],

  pacing_wpm: Number,
  pacing_feedback: String,

  pause_count: Number,
  total_pause_time_sec: Number,
  pause_feedback: String,

  text_feedback: String,

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transcription', transcriptionSchema);
