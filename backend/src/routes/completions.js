const express = require('express');
const router = express.Router();
const completionController = require('../controllers/completionController');
const { authenticateToken } = require('../middleware/auth');
const { createCompletionValidation, dateRangeValidation } = require('../middleware/validator');

// All routes require authentication
router.use(authenticateToken);

router.post('/', createCompletionValidation, completionController.createCompletion);
router.get('/today', completionController.getTodayCompletions);
router.get('/calendar', dateRangeValidation, completionController.getCalendarData);
router.get('/goal/:goalId', completionController.getGoalCompletions);

module.exports = router;

// Made with Bob
