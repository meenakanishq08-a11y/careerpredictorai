const express = require('express');
const router = express.Router();
const {
  generate, getHistory, getOne, deleteOne, updateRoadmap, simulate,
} = require('../controllers/recommendation.controller');
const { protect } = require('../middleware/auth.middleware');
const { recommendLimiter } = require('../middleware/rateLimit.middleware');

router.post('/', protect, recommendLimiter, generate);
router.get('/', protect, getHistory);
router.post('/simulate', protect, simulate);
router.get('/:id', protect, getOne);
router.delete('/:id', protect, deleteOne);
router.patch('/:id/roadmap', protect, updateRoadmap);

module.exports = router;
