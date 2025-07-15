const express = require('express');
const multer = require('multer');
const { handleTranscription } = require('../controllers/transcribeController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/transcribe', upload.single('audio'), handleTranscription);

module.exports = router;
