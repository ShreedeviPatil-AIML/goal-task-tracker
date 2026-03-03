const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

router.get('/weekly', analyticsController.getWeeklyAnalytics);
router.get('/monthly', analyticsController.getMonthlyAnalytics);
router.get('/export', analyticsController.exportData);
router.get('/xp', analyticsController.getUserXP);
router.get('/summary', analyticsController.getWeeklySummary);

module.exports = router;

// Made with Bob
