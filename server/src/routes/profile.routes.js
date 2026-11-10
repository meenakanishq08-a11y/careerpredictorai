const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getProfile);
router.put('/', protect, upsertProfile);

module.exports = router;
