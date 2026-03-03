const { query, transaction } = require('../config/database');

// Get all goals for user
const getGoals = async (req, res) => {
  try {
    const { active, category } = req.query;
    
    let queryText = `
      SELECT g.*, 
             s.current_streak, 
             s.longest_streak,
             COUNT(DISTINCT dc.id) FILTER (WHERE dc.completed = true) as completed_days,
             COUNT(DISTINCT dc.id) as total_days
      FROM goals g
      LEFT JOIN streaks s ON g.id = s.goal_id
      LEFT JOIN daily_completions dc ON g.id = dc.goal_id
      WHERE g.user_id = $1
    `;
    
    const params = [req.user.id];
    let paramIndex = 2;
    
    if (active !== undefined) {
      queryText += ` AND g.is_active = $${paramIndex}`;
      params.push(active === 'true');
      paramIndex++;
    }
    
    if (category) {
      queryText += ` AND g.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    queryText += ` GROUP BY g.id, s.current_streak, s.longest_streak ORDER BY g.created_at DESC`;
    
    const result = await query(queryText, params);
    
    res.json({
      success: true,
      data: result.rows.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        startDate: goal.start_date,
        endDate: goal.end_date,
        isActive: goal.is_active,
        color: goal.color,
        currentStreak: goal.current_streak || 0,
        longestStreak: goal.longest_streak || 0,
        completedDays: parseInt(goal.completed_days) || 0,
        totalDays: parseInt(goal.total_days) || 0,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
      })),
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals',
      error: error.message,
    });
  }
};

// Get single goal
const getGoal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT g.*, 
              s.current_streak, 
              s.longest_streak,
              s.last_completion_date
       FROM goals g
       LEFT JOIN streaks s ON g.id = s.goal_id
       WHERE g.id = $1 AND g.user_id = $2`,
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
    
    const goal = result.rows[0];
    
    res.json({
      success: true,
      data: {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        startDate: goal.start_date,
        endDate: goal.end_date,
        isActive: goal.is_active,
        color: goal.color,
        currentStreak: goal.current_streak || 0,
        longestStreak: goal.longest_streak || 0,
        lastCompletionDate: goal.last_completion_date,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
      },
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal',
      error: error.message,
    });
  }
};

// Create new goal
const createGoal = async (req, res) => {
  try {
    const { title, description, category, priority, startDate, endDate, color } = req.body;
    
    const result = await transaction(async (client) => {
      // Create goal
      const goalResult = await client.query(
        `INSERT INTO goals (user_id, title, description, category, priority, start_date, end_date, color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [req.user.id, title, description, category, priority, startDate, endDate, color || '#3B82F6']
      );
      
      const goal = goalResult.rows[0];
      
      // Create streak record
      await client.query(
        `INSERT INTO streaks (goal_id, user_id, current_streak, longest_streak)
         VALUES ($1, $2, 0, 0)`,
        [goal.id, req.user.id]
      );
      
      return goal;
    });
    
    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: {
        id: result.id,
        title: result.title,
        description: result.description,
        category: result.category,
        priority: result.priority,
        startDate: result.start_date,
        endDate: result.end_date,
        isActive: result.is_active,
        color: result.color,
        createdAt: result.created_at,
      },
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create goal',
      error: error.message,
    });
  }
};

// Update goal
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    const allowedFields = ['title', 'description', 'category', 'priority', 'startDate', 'endDate', 'isActive', 'color'];
    const dbFields = {
      title: 'title',
      description: 'description',
      category: 'category',
      priority: 'priority',
      startDate: 'start_date',
      endDate: 'end_date',
      isActive: 'is_active',
      color: 'color',
    };
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${dbFields[field]} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }
    
    values.push(id, req.user.id);
    
    const result = await query(
      `UPDATE goals 
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
    
    const goal = result.rows[0];
    
    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        startDate: goal.start_date,
        endDate: goal.end_date,
        isActive: goal.is_active,
        color: goal.color,
        updatedAt: goal.updated_at,
      },
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goal',
      error: error.message,
    });
  }
};

// Delete goal
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete goal',
      error: error.message,
    });
  }
};

// Get goal progress
const getGoalProgress = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify goal ownership
    const goalCheck = await query(
      'SELECT id FROM goals WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (goalCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
    
    // Get completion data
    const result = await query(
      `SELECT 
         completion_date,
         completed,
         notes,
         xp_earned
       FROM daily_completions
       WHERE goal_id = $1
       ORDER BY completion_date DESC
       LIMIT 90`,
      [id]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        date: row.completion_date,
        completed: row.completed,
        notes: row.notes,
        xpEarned: row.xp_earned,
      })),
    });
  } catch (error) {
    console.error('Get goal progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal progress',
      error: error.message,
    });
  }
};

module.exports = {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalProgress,
};

// Made with Bob
