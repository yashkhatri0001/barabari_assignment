exports.analyzePronunciation = (words) => {
    const confidenceThreshold = 0.85;
    let total = 0, score = 0;
  
    const mispronounced = [];
  
    words.forEach(word => {
      score += word.confidence;
      total++;
  
      if (word.confidence < confidenceThreshold) {
        mispronounced.push({
          word: word.word || word.text,
          start: word.start,
          confidence: word.confidence
        });
      }
    });
  
    return {
      score: Math.round((score / total) * 100),
      mispronounced
    };
  };
  exports.analyzePacing = (words, durationSec) => {
    const wpm = (words.length / durationSec) * 60;
    let feedback = "Your speaking pace is appropriate.";
  
    if (wpm < 90) feedback = "Too slow.";
    else if (wpm > 150) feedback = "Too fast.";
  
    return { wpm: Math.round(wpm), feedback };
  };
  exports.analyzePauses = (words) => {
    let count = 0;
    let totalDuration = 0;
  
    for (let i = 1; i < words.length; i++) {
      const pause = words[i].start - words[i - 1].end;
      if (pause > 0.5) {
        count++;
        totalDuration += pause;
      }
    }
  
    const feedback = count > 2
      ? "Try to reduce long pauses to improve fluency."
      : "Your pause pattern is fine.";
  
    return {
      count,
      totalDuration: Number(totalDuration.toFixed(2)),
      feedback
    };
  };

exports.generateFeedback = (pronunciation, pacing, pauseData) => {
  let feedback = '';
  if (pacing.feedback === 'Too slow.') {
    feedback += 'You spoke too slowly. ';
  } else if (pacing.feedback === 'Too fast.') {
    feedback += 'You spoke too fast. ';
  } else {
    feedback += 'You spoke at a good pace. ';
  }

  if (pronunciation.mispronounced && pronunciation.mispronounced.length > 0) {
    const words = pronunciation.mispronounced.map(w => `'${w.word}'`).join(', ');
    feedback += `Focus on pronouncing ${words} more clearly. `;
  }

  if (pauseData.feedback && pauseData.feedback.includes('reduce long pauses')) {
    feedback += 'Try to reduce long pauses.';
  }

  return feedback.trim();
};
      