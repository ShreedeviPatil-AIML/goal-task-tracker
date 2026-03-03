// XP calculation utilities

const XP_REWARDS = {
  DAILY_COMPLETION: 10,
  STREAK_3_DAYS: 5,
  STREAK_7_DAYS: 15,
  STREAK_30_DAYS: 50,
  GOAL_COMPLETED: 100,
  ALL_DAILY_GOALS: 20,
};

/**
 * Calculate level from total XP
 * Formula: level = floor(sqrt(totalXP / 100)) + 1
 */
const calculateLevel = (totalXP) => {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

/**
 * Calculate XP needed for next level
 */
const xpForNextLevel = (currentLevel) => {
  return currentLevel * currentLevel * 100;
};

/**
 * Calculate XP progress to next level
 */
const calculateLevelProgress = (totalXP) => {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = (currentLevel - 1) * (currentLevel - 1) * 100;
  const nextLevelXP = xpForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  
  return {
    currentLevel,
    totalXP,
    xpInCurrentLevel,
    xpNeededForLevel,
    xpToNextLevel: nextLevelXP - totalXP,
    progressPercentage: Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100),
  };
};

/**
 * Calculate XP for completion with streak bonuses
 */
const calculateCompletionXP = (currentStreak) => {
  let xp = XP_REWARDS.DAILY_COMPLETION;
  
  if (currentStreak >= 30) {
    xp += XP_REWARDS.STREAK_30_DAYS;
  } else if (currentStreak >= 7) {
    xp += XP_REWARDS.STREAK_7_DAYS;
  } else if (currentStreak >= 3) {
    xp += XP_REWARDS.STREAK_3_DAYS;
  }
  
  return xp;
};

/**
 * Get streak milestone message
 */
const getStreakMilestone = (streak) => {
  if (streak === 3) return '🔥 3-day streak! Keep it up!';
  if (streak === 7) return '⭐ 7-day streak! You\'re on fire!';
  if (streak === 14) return '💪 2-week streak! Incredible!';
  if (streak === 30) return '🏆 30-day streak! Legendary!';
  if (streak === 60) return '👑 60-day streak! Unstoppable!';
  if (streak === 100) return '🎯 100-day streak! Master level!';
  return null;
};

/**
 * Check if user leveled up
 */
const checkLevelUp = (oldXP, newXP) => {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);
  return {
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
  };
};

module.exports = {
  XP_REWARDS,
  calculateLevel,
  xpForNextLevel,
  calculateLevelProgress,
  calculateCompletionXP,
  getStreakMilestone,
  checkLevelUp,
};

// Made with Bob
