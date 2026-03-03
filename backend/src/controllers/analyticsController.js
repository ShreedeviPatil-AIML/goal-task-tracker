const { query } = require('../config/database');
const { calculateLevelProgress } = require('../utils/xp');

// Get weekly analytics
const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // Get completion stats
    const completionStats = await query(
      `SELECT 
         COUNT(*) FILTER (WHERE completed = true) as completed_count,
         COUNT(*) as total_count,
         SUM(xp_earned) as total_xp
       FROM daily_completions
       WHERE user_id = $1 
         AND completion_date >= $2 
         AND completion_date <= $3`,
      [userId, weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );
    
    // Get daily breakdown
    const dailyBreakdown = await query(
      `SELECT 
         completion_date,
         COUNT(*) FILTER (WHERE completed = true) as completed,
         COUNT(*) as total,
         SUM(xp_earned) as xp
       FROM daily_completions
       WHERE user_id = $1 
         AND completion_date >= $2 
         AND completion_date <= $3
       GROUP BY completion_date
       ORDER BY completion_date`,
      [userId, weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );
    
    // Get category breakdown
    const categoryBreakdown = await query(
      `SELECT 
         g.category,
         COUNT(*) FILTER (WHERE dc.completed = true) as completed,
         COUNT(*) as total
       FROM daily_completions dc
       JOIN goals g ON dc.goal_id = g.id
       WHERE dc.user_id = $1 
         AND dc.completion_date >= $2 
         AND dc.completion_date <= $3
       GROUP BY g.category`,
      [userId, weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );
    
    // Get best performing goal
    const bestGoal = await query(
      `SELECT 
         g.id,
         g.title,
         g.category,
         COUNT(*) FILTER (WHERE dc.completed = true) as completed_count,
         COUNT(*) as total_count
       FROM goals g
       LEFT JOIN daily_completions dc ON g.id = dc.goal_id 
         AND dc.completion_date >= $2 
         AND dc.completion_date <= $3
       WHERE g.user_id = $1
       GROUP BY g.id, g.title, g.category
       HAVING COUNT(*) > 0
       ORDER BY (COUNT(*) FILTER (WHERE dc.completed = true)::float / COUNT(*)) DESC
       LIMIT 1`,
      [userId, weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );
    
    // Get current streaks
    const streaks = await query(
      `SELECT 
         g.title,
         s.current_streak,
         s.longest_streak
       FROM streaks s
       JOIN goals g ON s.goal_id = g.id
       WHERE s.user_id = $1 AND s.current_streak > 0
       ORDER BY s.current_streak DESC
       LIMIT 5`,
      [userId]
    );
    
    const stats = completionStats.rows[0];
    const completionRate = stats.total_count > 0 
      ? Math.round((stats.completed_count / stats.total_count) * 100) 
      : 0;
    
    res.json({
      success: true,
      data: {
        summary: {
          completedTasks: parseInt(stats.completed_count) || 0,
          totalTasks: parseInt(stats.total_count) || 0,
          completionRate,
          totalXP: parseInt(stats.total_xp) || 0,
        },
        dailyBreakdown: dailyBreakdown.rows.map(row => ({
          date: row.completion_date,
          completed: parseInt(row.completed) || 0,
          total: parseInt(row.total) || 0,
          xp: parseInt(row.xp) || 0,
        })),
        categoryBreakdown: categoryBreakdown.rows.map(row => ({
          category: row.category,
          completed: parseInt(row.completed) || 0,
          total: parseInt(row.total) || 0,
          rate: row.total > 0 ? Math.round((row.completed / row.total) * 100) : 0,
        })),
        bestGoal: bestGoal.rows.length > 0 ? {
          id: bestGoal.rows[0].id,
          title: bestGoal.rows[0].title,
          category: bestGoal.rows[0].category,
          completionRate: Math.round((bestGoal.rows[0].completed_count / bestGoal.rows[0].total_count) * 100),
        } : null,
        activeStreaks: streaks.rows.map(row => ({
          goalTitle: row.title,
          currentStreak: row.current_streak,
          longestStreak: row.longest_streak,
        })),
      },
    });
  } catch (error) {
    console.error('Get weekly analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly analytics',
      error: error.message,
    });
  }
};

// Get monthly analytics
const getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const stats = await query(
      `SELECT 
         COUNT(*) FILTER (WHERE completed = true) as completed_count,
         COUNT(*) as total_count,
         SUM(xp_earned) as total_xp,
         COUNT(DISTINCT completion_date) as active_days
       FROM daily_completions
       WHERE user_id = $1 
         AND completion_date >= $2 
         AND completion_date <= $3`,
      [userId, monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );
    
    const result = stats.rows[0];
    const completionRate = result.total_count > 0 
      ? Math.round((result.completed_count / result.total_count) * 100) 
      : 0;
    
    res.json({
      success: true,
      data: {
        completedTasks: parseInt(result.completed_count) || 0,
        totalTasks: parseInt(result.total_count) || 0,
        completionRate,
        totalXP: parseInt(result.total_xp) || 0,
        activeDays: parseInt(result.active_days) || 0,
      },
    });
  } catch (error) {
    console.error('Get monthly analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly analytics',
      error: error.message,
    });
  }
};

// Export data to CSV
const exportData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await query(
      `SELECT 
         g.title as goal_title,
         g.category,
         g.priority,
         dc.completion_date,
         dc.completed,
         dc.notes,
         dc.xp_earned
       FROM daily_completions dc
       JOIN goals g ON dc.goal_id = g.id
       WHERE dc.user_id = $1
       ORDER BY dc.completion_date DESC`,
      [userId]
    );
    
    // Generate CSV
    const headers = ['Goal Title', 'Category', 'Priority', 'Date', 'Completed', 'Notes', 'XP Earned'];
    const csvRows = [headers.join(',')];
    
    for (const row of result.rows) {
      const values = [
        `"${row.goal_title}"`,
        row.category,
        row.priority,
        row.completion_date,
        row.completed ? 'Yes' : 'No',
        `"${row.notes || ''}"`,
        row.xp_earned,
      ];
      csvRows.push(values.join(','));
    }
    
    const csv = csvRows.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=goal-tracker-export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message,
    });
  }
};

// Get user XP and level info
const getUserXP = async (req, res) => {
  try {
    const result = await query(
      'SELECT total_xp, level FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    const user = result.rows[0];
    const levelProgress = calculateLevelProgress(user.total_xp);
    
    res.json({
      success: true,
      data: levelProgress,
    });
  } catch (error) {
    console.error('Get user XP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch XP info',
      error: error.message,
    });
  }
};

// Generate AI weekly summary (rule-based)
const getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // Get stats
    const stats = await query(
      `SELECT 
         COUNT(*) FILTER (WHERE completed = true) as completed_count,
         COUNT(*) as total_count,
         SUM(xp_earned) as total_xp
       FROM daily_completions
       WHERE user_id = $1 
         AND completion_date >= $2`,
      [userId, weekAgo.toISOString().split('T')[0]]
    );
    
    // Get best and worst goals
    const goalPerformance = await query(
      `SELECT 
         g.title,
         COUNT(*) FILTER (WHERE dc.completed = true) as completed,
         COUNT(*) as total
       FROM goals g
       LEFT JOIN daily_completions dc ON g.id = dc.goal_id 
         AND dc.completion_date >= $2
       WHERE g.user_id = $1 AND g.is_active = true
       GROUP BY g.id, g.title
       HAVING COUNT(*) > 0
       ORDER BY (COUNT(*) FILTER (WHERE dc.completed = true)::float / COUNT(*)) DESC`,
      [userId, weekAgo.toISOString().split('T')[0]]
    );
    
    const result = stats.rows[0];
    const completionRate = result.total_count > 0 
      ? Math.round((result.completed_count / result.total_count) * 100) 
      : 0;
    
    const bestGoal = goalPerformance.rows[0];
    const worstGoal = goalPerformance.rows[goalPerformance.rows.length - 1];
    
    // Generate summary
    let summary = `📊 Weekly Summary\n\n`;
    summary += `✅ Completion Rate: ${completionRate}%\n`;
    summary += `🎯 Tasks Completed: ${result.completed_count}/${result.total_count}\n`;
    summary += `⭐ XP Earned: ${result.total_xp || 0}\n\n`;
    
    if (bestGoal) {
      const bestRate = Math.round((bestGoal.completed / bestGoal.total) * 100);
      summary += `🏆 Best Performing: ${bestGoal.title} (${bestRate}%)\n`;
    }
    
    if (worstGoal && worstGoal.title !== bestGoal?.title) {
      const worstRate = Math.round((worstGoal.completed / worstGoal.total) * 100);
      summary += `📈 Needs Focus: ${worstGoal.title} (${worstRate}%)\n`;
    }
    
    // Add motivational message
    if (completionRate >= 80) {
      summary += `\n💪 Outstanding work! You're crushing your goals!`;
    } else if (completionRate >= 60) {
      summary += `\n👍 Great progress! Keep up the momentum!`;
    } else if (completionRate >= 40) {
      summary += `\n🎯 Good effort! Focus on consistency this week.`;
    } else {
      summary += `\n💡 Let's make this week count! Start with small wins.`;
    }
    
    res.json({
      success: true,
      data: {
        summary,
        stats: {
          completionRate,
          completedTasks: parseInt(result.completed_count) || 0,
          totalTasks: parseInt(result.total_count) || 0,
          totalXP: parseInt(result.total_xp) || 0,
        },
      },
    });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary',
      error: error.message,
    });
  }
};

module.exports = {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  exportData,
  getUserXP,
  getWeeklySummary,
};

// Made with Bob
