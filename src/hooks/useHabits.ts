/**
 * useHabits - Central state management hook for habit tracking
 * 
 * Provides a complete habit management system:
 * - Persistent storage with localStorage
 * - CRUD operations for habits
 * - Progress tracking and completion logic
 * - Import/export functionality
 * - Optimistic updates with toast feedback
 * 
 * Acts as the single source of truth for habit data and
 * coordinates with the adaptive goal system.
 */

import { useState, useEffect } from "react";
import { Habit, HabitCompletion } from "@/types/habit";
import { applyAdaptiveGoal, calculateStreaks } from "@/utils/habitLogic";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "tinyhabits_data";

/**
 * Custom hook for managing habits with adaptive goals
 */
export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHabits(parsed.habits || []);
      }
    } catch (error) {
      console.error("Failed to load habits:", error);
      toast({
        title: "Error loading habits",
        description: "Could not load your habits from storage.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save habits to LocalStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ habits, version: "1.0" })
        );
      } catch (error) {
        console.error("Failed to save habits:", error);
        toast({
          title: "Error saving habits",
          description: "Could not save your habits to storage.",
          variant: "destructive",
        });
      }
    }
  }, [habits, isLoading]);

  /**
   * Add a new habit
   */
  const addHabit = (habitData: Omit<Habit, "id" | "completions" | "currentStreak" | "longestStreak" | "successStreak" | "missedStreak" | "createdAt" | "updatedAt">) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      completions: [],
      currentStreak: 0,
      longestStreak: 0,
      successStreak: 0,
      missedStreak: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, newHabit]);
    
    toast({
      title: "Habit created! 🎉",
      description: `"${newHabit.title}" has been added to your habits.`,
    });

    return newHabit;
  };

  /**
   * Update an existing habit
   */
  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, ...updates, updatedAt: new Date().toISOString() }
          : h
      )
    );
    
    toast({
      title: "Habit updated",
      description: "Your changes have been saved.",
    });
  };

  /**
   * Delete a habit
   */
  const deleteHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    
    toast({
      title: "Habit deleted",
      description: habit ? `"${habit.title}" has been removed.` : "Habit removed.",
    });
  };

  /**
   * Mark habit as completed for today
   */
  const completeHabit = (id: string, note?: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;

        const today = new Date().toISOString().split("T")[0];
        const existingCompletion = habit.completions.find((c) => c.date === today);

        // Don't add duplicate completion
        if (existingCompletion?.completed) {
          toast({
            title: "Already completed",
            description: "You've already marked this habit as done today!",
          });
          return habit;
        }

        // Apply adaptive goal logic
        const adaptedHabit = applyAdaptiveGoal(habit, true);

        // Create completion record
        const completion: HabitCompletion = {
          id: crypto.randomUUID(),
          habitId: id,
          date: today,
          completed: true,
          goalAtTime: habit.currentGoal,
          note,
          timestamp: new Date().toISOString(),
        };

        // Update completions and calculate streaks
        const updatedCompletions = existingCompletion
          ? habit.completions.map((c) => (c.date === today ? completion : c))
          : [...habit.completions, completion];

        const { currentStreak, longestStreak } = calculateStreaks(updatedCompletions);

        const updatedHabit = {
          ...adaptedHabit,
          completions: updatedCompletions,
          currentStreak,
          longestStreak,
          updatedAt: new Date().toISOString(),
        };

        // Show appropriate toast based on adaptation
        if (adaptedHabit.currentGoal > habit.currentGoal) {
          toast({
            title: "Awesome! Goal increased! 📈",
            description: `Your goal for "${habit.title}" is now ${adaptedHabit.currentGoal} ${habit.unit}.`,
          });
        } else {
          toast({
            title: "Great job! ✅",
            description: `Streak: ${updatedHabit.currentStreak} day${updatedHabit.currentStreak !== 1 ? "s" : ""}`,
          });
        }

        return updatedHabit;
      })
    );
  };

  /**
   * Mark habit as missed for today
   */
  const missHabit = (id: string, note?: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;

        const today = new Date().toISOString().split("T")[0];
        const existingCompletion = habit.completions.find((c) => c.date === today);

        // Apply adaptive goal logic
        const adaptedHabit = applyAdaptiveGoal(habit, false);

        // Create completion record (marked as missed)
        const completion: HabitCompletion = {
          id: crypto.randomUUID(),
          habitId: id,
          date: today,
          completed: false,
          goalAtTime: habit.currentGoal,
          note,
          timestamp: new Date().toISOString(),
        };

        // Update completions and calculate streaks
        const updatedCompletions = existingCompletion
          ? habit.completions.map((c) => (c.date === today ? completion : c))
          : [...habit.completions, completion];

        const { currentStreak, longestStreak } = calculateStreaks(updatedCompletions);

        const updatedHabit = {
          ...adaptedHabit,
          completions: updatedCompletions,
          currentStreak,
          longestStreak: Math.max(longestStreak, habit.longestStreak),
          updatedAt: new Date().toISOString(),
        };

        // Show appropriate toast based on adaptation
        if (adaptedHabit.currentGoal < habit.currentGoal) {
          toast({
            title: "Goal adjusted 🎯",
            description: `Don't worry! Your goal for "${habit.title}" is now ${adaptedHabit.currentGoal} ${habit.unit}. You've got this!`,
          });
        } else {
          toast({
            title: "Marked as missed",
            description: "That's okay! Tomorrow is a new day. Keep going! 💪",
          });
        }

        return updatedHabit;
      })
    );
  };

  /**
   * Import habits from JSON
   */
  const importHabits = (data: { habits: Habit[] }) => {
    try {
      setHabits(data.habits);
      toast({
        title: "Import successful",
        description: `Imported ${data.habits.length} habit${data.habits.length !== 1 ? "s" : ""}.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Could not import habits. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  /**
   * Export habits to JSON
   */
  const exportHabits = () => {
    return { habits, version: "1.0", exportedAt: new Date().toISOString() };
  };

  /**
   * Clear all habits (with confirmation)
   */
  const clearAllHabits = () => {
    setHabits([]);
    toast({
      title: "All habits cleared",
      description: "Your habit data has been reset.",
    });
  };

  return {
    habits,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    missHabit,
    importHabits,
    exportHabits,
    clearAllHabits,
  };
}
