const express = require('express');
const router = express.Router();
const { ambilDataVitals } = require('../controllers/vitalsController');

router.get('/', ambilDataVitals);

module.exports = router;
