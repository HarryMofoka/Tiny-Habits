/**
 * Core habit tracking engine - Implements adaptive goal algorithms
 * 
 * This module handles the intelligent adjustment of habit goals based on user performance:
 * - Automatically increases goals when users show consistent success
 * - Gracefully decreases goals when users struggle
 * - Tracks streaks and calculates statistics
 * 
 * The adaptive algorithm aims to keep users in their growth zone:
 * challenging enough to promote growth, but not so hard they give up.
 */

import { Habit, HabitCompletion, HabitStats } from "@/types/habit";

/**
 * Adaptive Goal Algorithm
 * Shrinks goal when user struggles, grows when user succeeds
 * 
 * @param habit - The habit to adapt
 * @param completed - Whether the habit was completed today
 * @returns Updated habit with new adaptive goal
 */
export function applyAdaptiveGoal(habit: Habit, completed: boolean): Habit {
  const updatedHabit = { ...habit };

  if (completed) {
    // Success! Increment success streak, reset missed streak
    updatedHabit.successStreak += 1;
    updatedHabit.missedStreak = 0;

    // Grow goal if threshold reached
    if (updatedHabit.successStreak >= updatedHabit.growThreshold) {
      const newGoal = Math.min(
        updatedHabit.maxGoal,
        Math.round(updatedHabit.currentGoal * 1.1) // Grow by 10%
      );
      
      if (newGoal !== updatedHabit.currentGoal) {
        updatedHabit.currentGoal = newGoal;
        updatedHabit.successStreak = 0; // Reset after adaptation
      }
    }
  } else {
    // Missed! Increment missed streak, reset success streak
    updatedHabit.missedStreak += 1;
    updatedHabit.successStreak = 0;

    // Shrink goal if threshold reached
    if (updatedHabit.missedStreak >= updatedHabit.shrinkThreshold) {
      const newGoal = Math.max(
        updatedHabit.minGoal,
        Math.round(updatedHabit.currentGoal * 0.8) // Shrink by 20%
      );
      
      if (newGoal !== updatedHabit.currentGoal) {
        updatedHabit.currentGoal = newGoal;
        updatedHabit.missedStreak = 0; // Reset after adaptation
      }
    }
  }

  return updatedHabit;
}

/**
 * Calculate overall streaks from completions
 */
export function calculateStreaks(completions: HabitCompletion[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (completions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort by date descending (newest first)
  const sorted = [...completions]
    .filter((c) => c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Calculate current streak (must include today or yesterday)
  for (let i = 0; i < sorted.length; i++) {
    const date = sorted[i].date;
    
    if (i === 0 && (date === today || date === yesterday)) {
      currentStreak = 1;
      tempStreak = 1;
    } else if (i > 0) {
      const prevDate = sorted[i - 1].date;
      const daysDiff = Math.round(
        (new Date(prevDate).getTime() - new Date(date).getTime()) / 86400000
      );
      
      if (daysDiff === 1) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = sorted[i - 1].date;
    const date = sorted[i].date;
    const daysDiff = Math.round(
      (new Date(prevDate).getTime() - new Date(date).getTime()) / 86400000
    );
    
    if (daysDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

/**
 * Calculate comprehensive habit statistics
 */
export function calculateHabitStats(habit: Habit): HabitStats {
  const completions = habit.completions.filter((c) => c.completed);
  const misses = habit.completions.filter((c) => !c.completed);
  const total = habit.completions.length;

  const successRate = total > 0 ? (completions.length / total) * 100 : 0;

  // Count how many times the goal has changed
  const uniqueGoals = new Set(habit.completions.map((c) => c.goalAtTime));
  const adaptations = uniqueGoals.size - 1; // Subtract 1 for initial goal

  const lastCompleted = completions.length > 0
    ? completions[completions.length - 1].date
    : undefined;

  return {
    totalCompletions: completions.length,
    totalMisses: misses.length,
    successRate: Math.round(successRate),
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    adaptations,
    lastCompleted,
  };
}

/**
 * Check if habit was completed today
 */
export function isCompletedToday(habit: Habit): boolean {
  const today = new Date().toISOString().split("T")[0];
  return habit.completions.some(
    (c) => c.date === today && c.completed
  );
}

/**
 * Get today's completion entry (if any)
 */
export function getTodayCompletion(habit: Habit): HabitCompletion | undefined {
  const today = new Date().toISOString().split("T")[0];
  return habit.completions.find((c) => c.date === today);
}
