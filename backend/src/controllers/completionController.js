const { query, transaction } = require('../config/database');
const { calculateCompletionXP, getStreakMilestone, checkLevelUp } = require('../utils/xp');

// Create or update daily completion
const createCompletion = async (req, res) => {
  try {
    const { goalId, completionDate, completed, notes } = req.body;
    let isNewCompletion = false;
    
    const result = await transaction(async (client) => {
      // Verify goal ownership
      const goalCheck = await client.query(
        'SELECT id, title FROM goals WHERE id = $1 AND user_id = $2',
        [goalId, req.user.id]
      );
      
      if (goalCheck.rows.length === 0) {
        throw new Error('Goal not found');
      }
      
      const goal = goalCheck.rows[0];
      
      // Get or create streak
      let streakResult = await client.query(
        'SELECT * FROM streaks WHERE goal_id = $1',
        [goalId]
      );
      
      let streak = streakResult.rows[0];
      if (!streak) {
        const newStreak = await client.query(
          `INSERT INTO streaks (goal_id, user_id, current_streak, longest_streak)
           VALUES ($1, $2, 0, 0)
           RETURNING *`,
          [goalId, req.user.id]
        );
        streak = newStreak.rows[0];
      }
      
      // Check if completion already exists
      const existingCompletion = await client.query(
        'SELECT * FROM daily_completions WHERE goal_id = $1 AND completion_date = $2',
        [goalId, completionDate]
      );
      
      let completion;
      isNewCompletion = existingCompletion.rows.length === 0;
      
      if (isNewCompletion) {
        // Create new completion
        const xpEarned = completed ? calculateCompletionXP(streak.current_streak) : 0;
        
        const completionResult = await client.query(
          `INSERT INTO daily_completions (goal_id, user_id, completion_date, completed, notes, xp_earned)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [goalId, req.user.id, completionDate, completed, notes, xpEarned]
        );
        
        completion = completionResult.rows[0];
        
        if (completed) {
          // Update streak
          const lastDate = streak.last_completion_date ? new Date(streak.last_completion_date) : null;
          const currentDate = new Date(completionDate);
          
          let newStreak = streak.current_streak;
          
          if (!lastDate) {
            newStreak = 1;
          } else {
            const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
              newStreak = streak.current_streak + 1;
            } else if (daysDiff > 1) {
              newStreak = 1;
            }
          }
          
          const longestStreak = Math.max(newStreak, streak.longest_streak);
          
          await client.query(
            `UPDATE streaks 
             SET current_streak = $1, longest_streak = $2, last_completion_date = $3
             WHERE goal_id = $4`,
            [newStreak, longestStreak, completionDate, goalId]
          );
          
          // Update user XP
          const userResult = await client.query(
            'SELECT total_xp FROM users WHERE id = $1',
            [req.user.id]
          );
          
          const oldXP = userResult.rows[0].total_xp;
          const newXP = oldXP + xpEarned;
          
          await client.query(
            'UPDATE users SET total_xp = $1 WHERE id = $2',
            [newXP, req.user.id]
          );
          
          // Record XP history
          await client.query(
            `INSERT INTO xp_history (user_id, goal_id, xp_amount, reason)
             VALUES ($1, $2, $3, $4)`,
            [req.user.id, goalId, xpEarned, 'daily_completion']
          );
          
          // Check level up
          const levelInfo = checkLevelUp(oldXP, newXP);
          
          if (levelInfo.leveledUp) {
            await client.query(
              'UPDATE users SET level = $1 WHERE id = $2',
              [levelInfo.newLevel, req.user.id]
            );
          }
          
          streak.current_streak = newStreak;
          streak.longest_streak = longestStreak;
          
          return {
            completion,
            streak: {
              current: newStreak,
              longest: longestStreak,
              milestone: getStreakMilestone(newStreak),
            },
            xp: {
              earned: xpEarned,
              total: newXP,
              leveledUp: levelInfo.leveledUp,
              newLevel: levelInfo.newLevel,
            },
          };
        }
      } else {
        // Update existing completion
        const oldCompleted = existingCompletion.rows[0].completed;
        const xpEarned = completed && !oldCompleted ? calculateCompletionXP(streak.current_streak) : 0;
        
        const completionResult = await client.query(
          `UPDATE daily_completions 
           SET completed = $1, notes = $2, xp_earned = xp_earned + $3
           WHERE id = $4
           RETURNING *`,
          [completed, notes, xpEarned, existingCompletion.rows[0].id]
        );
        
        completion = completionResult.rows[0];
        
        if (completed && !oldCompleted) {
          // Award XP for newly completed task
          const userResult = await client.query(
            'SELECT total_xp FROM users WHERE id = $1',
            [req.user.id]
          );
          
          const oldXP = userResult.rows[0].total_xp;
          const newXP = oldXP + xpEarned;
          
          await client.query(
            'UPDATE users SET total_xp = $1 WHERE id = $2',
            [newXP, req.user.id]
          );
          
          await client.query(
            `INSERT INTO xp_history (user_id, goal_id, xp_amount, reason)
             VALUES ($1, $2, $3, $4)`,
            [req.user.id, goalId, xpEarned, 'daily_completion']
          );
          
          const levelInfo = checkLevelUp(oldXP, newXP);
          
          if (levelInfo.leveledUp) {
            await client.query(
              'UPDATE users SET level = $1 WHERE id = $2',
              [levelInfo.newLevel, req.user.id]
            );
          }
          
          return {
            completion,
            streak: {
              current: streak.current_streak,
              longest: streak.longest_streak,
            },
            xp: {
              earned: xpEarned,
              total: newXP,
              leveledUp: levelInfo.leveledUp,
              newLevel: levelInfo.newLevel,
            },
          };
        }
      }
      
      return {
        completion,
        streak: {
          current: streak.current_streak,
          longest: streak.longest_streak,
        },
      };
    });
    
    res.status(isNewCompletion ? 201 : 200).json({
      success: true,
      message: completed ? 'Goal completed! 🎉' : 'Completion updated',
      data: result,
    });
  } catch (error) {
    console.error('Create completion error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create completion',
    });
  }
};

// Get today's completions
const getTodayCompletions = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await query(
      `SELECT dc.*, g.title, g.category, g.color, g.priority
       FROM daily_completions dc
       JOIN goals g ON dc.goal_id = g.id
       WHERE dc.user_id = $1 AND dc.completion_date = $2
       ORDER BY g.priority DESC, g.created_at`,
      [req.user.id, today]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        goalId: row.goal_id,
        goalTitle: row.title,
        category: row.category,
        color: row.color,
        priority: row.priority,
        completed: row.completed,
        notes: row.notes,
        xpEarned: row.xp_earned,
        completionDate: row.completion_date,
      })),
    });
  } catch (error) {
    console.error('Get today completions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s completions',
      error: error.message,
    });
  }
};

// Get calendar heatmap data
const getCalendarData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await query(
      `SELECT 
         completion_date,
         COUNT(*) FILTER (WHERE completed = true) as completed_count,
         COUNT(*) as total_count,
         SUM(xp_earned) as total_xp
       FROM daily_completions
       WHERE user_id = $1 
         AND completion_date >= $2 
         AND completion_date <= $3
       GROUP BY completion_date
       ORDER BY completion_date`,
      [req.user.id, startDate, endDate]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        date: row.completion_date,
        completedCount: parseInt(row.completed_count),
        totalCount: parseInt(row.total_count),
        totalXP: parseInt(row.total_xp) || 0,
        intensity: Math.min(parseInt(row.completed_count) / parseInt(row.total_count), 1),
      })),
    });
  } catch (error) {
    console.error('Get calendar data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar data',
      error: error.message,
    });
  }
};

// Get completions for a specific goal
const getGoalCompletions = async (req, res) => {
  try {
    const { goalId } = req.params;
    
    // Verify goal ownership
    const goalCheck = await query(
      'SELECT id, title FROM goals WHERE id = $1 AND user_id = $2',
      [goalId, req.user.id]
    );
    
    if (goalCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }
    
    const result = await query(
      `SELECT * FROM daily_completions
       WHERE goal_id = $1 AND user_id = $2
       ORDER BY completion_date DESC`,
      [goalId, req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        goalId: row.goal_id,
        completionDate: row.completion_date,
        completed: row.completed,
        notes: row.notes,
        xpEarned: row.xp_earned,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('Get goal completions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal completions',
      error: error.message,
    });
  }
};

module.exports = {
  createCompletion,
  getTodayCompletions,
  getCalendarData,
  getGoalCompletions,
};

// Made with Bob
