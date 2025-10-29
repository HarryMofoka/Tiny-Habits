/**
 * Index Page - Main Habit List
 * Display all habits as cards with quick actions
 */

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HabitCard } from "@/components/HabitCard";
import { AddHabitModal, HabitFormData } from "@/components/AddHabitModal";
import { useHabits } from "@/hooks/useHabits";
import { Habit } from "@/types/habit";
import { Loader2 } from "lucide-react";

const Index = () => {
  const {
    habits,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    missHabit,
  } = useHabits();

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleAddHabit = (data: HabitFormData) => {
    addHabit(data);
  };

  const handleEditHabit = (data: HabitFormData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
      setEditingHabit(null);
    }
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Your Habits</h1>
            <p className="text-muted-foreground">
              Build lasting change, one tiny habit at a time
            </p>
          </div>
          <AddHabitModal onSubmit={handleAddHabit} />
        </div>

        {/* Habits grid */}
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 text-6xl">🌱</div>
            <h2 className="text-2xl font-semibold mb-2">No habits yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start your journey by creating your first habit. 
              Goals will adapt to your performance automatically!
            </p>
            <AddHabitModal onSubmit={handleAddHabit} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={completeHabit}
                onMiss={missHabit}
                onEdit={handleOpenEdit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}

        {/* Edit modal */}
        {editingHabit && (
          <AddHabitModal
            open={!!editingHabit}
            onOpenChange={(open) => !open && setEditingHabit(null)}
            editHabit={editingHabit}
            onSubmit={handleEditHabit}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
