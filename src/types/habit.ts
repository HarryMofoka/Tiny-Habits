/**
 * TinyHabits Type System - Defines the core data model
 * 
 * Implements an adaptive goal system where:
 * - Each habit has base, current, min and max goals
 * - Goals automatically adjust based on user performance
 * - Completions track historical performance and goal state
 * - Stats provide insights into habit strength and adaptations
 * 
 * The type system ensures the adaptive algorithm has all
 * necessary data to make intelligent goal adjustments while
 * maintaining safety bounds.
 */

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  
  // Goal system
  baseGoal: number; // The original target goal
  currentGoal: number; // Adaptive goal that changes based on performance
  minGoal: number; // Minimum goal (safety floor)
  maxGoal: number; // Maximum goal (ceiling)
  unit: string; // e.g., "minutes", "pages", "reps"
  
  // Tracking
  completions: HabitCompletion[];
  currentStreak: number;
  longestStreak: number;
  
  // Adaptive algorithm state
  successStreak: number; // Consecutive successes (grows goal)
  missedStreak: number; // Consecutive misses (shrinks goal)
  
  // Thresholds for adaptation
  shrinkThreshold: number; // Misses before shrinking (default: 2)
  growThreshold: number; // Successes before growing (default: 3)
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  color?: string; // Visual identifier
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean; // true = done, false = missed
  goalAtTime: number; // What was the goal when this was logged?
  note?: string;
  timestamp: string; // Full ISO timestamp
}

export interface HabitStats {
  totalCompletions: number;
  totalMisses: number;
  successRate: number; // Percentage
  currentStreak: number;
  longestStreak: number;
  adaptations: number; // How many times goal has changed
  lastCompleted?: string;
}

export type HabitFilter = "all" | "active" | "struggling" | "thriving";
