const { transcribeAudio } = require('../utils/deepgram');
const { analyzePronunciation, analyzePacing, analyzePauses, generateFeedback } = require('../utils/analysis');
const Transcription = require('../models/Transcription');

exports.handleTranscription = async (req, res) => {
  const audioPath = req.file.path;

  try {
    const transcriptData = await transcribeAudio(audioPath);
    const pronunciation = analyzePronunciation(transcriptData.words);
    const pacing = analyzePacing(transcriptData.words, transcriptData.audio_duration_sec);
    const pauseData = analyzePauses(transcriptData.words);
    const feedback = generateFeedback(pronunciation, pacing, pauseData);

    // Save to MongoDB
    const transcriptionDoc = new Transcription({
      transcript: transcriptData.transcript,
      words: transcriptData.words,
      audio_duration_sec: transcriptData.audio_duration_sec,
      pronunciation_score: pronunciation.score,
      mispronounced_words: pronunciation.mispronounced,
      pacing_wpm: pacing.wpm,
      pacing_feedback: pacing.feedback,
      pause_count: pauseData.count,
      total_pause_time_sec: pauseData.totalDuration,
      pause_feedback: pauseData.feedback,
      text_feedback: feedback
    });
    await transcriptionDoc.save();

    res.json({
      transcript: transcriptData.transcript,
      words: transcriptData.words,
      audio_duration_sec: transcriptData.audio_duration_sec,
      pronunciation_score: pronunciation.score,
      mispronounced_words: pronunciation.mispronounced,
      pacing_wpm: pacing.wpm,
      pacing_feedback: pacing.feedback,
      pause_count: pauseData.count,
      total_pause_time_sec: pauseData.totalDuration,
      pause_feedback: pauseData.feedback,
      text_feedback: feedback
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
