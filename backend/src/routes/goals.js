const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { authenticateToken } = require('../middleware/auth');
const { createGoalValidation, updateGoalValidation, uuidParamValidation } = require('../middleware/validator');

// All routes require authentication
router.use(authenticateToken);

router.get('/', goalController.getGoals);
router.post('/', createGoalValidation, goalController.createGoal);
router.get('/:id', uuidParamValidation, goalController.getGoal);
router.put('/:id', updateGoalValidation, goalController.updateGoal);
router.delete('/:id', uuidParamValidation, goalController.deleteGoal);
router.get('/:id/progress', uuidParamValidation, goalController.getGoalProgress);

module.exports = router;

// Made with Bob
