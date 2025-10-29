/**
 * Goals Page - Goal Management
 * View and adjust all habit goals and thresholds
 */

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useHabits } from "@/hooks/useHabits";
import { Habit } from "@/types/habit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Goals = () => {
  const { habits, updateHabit } = useHabits();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEditGoals = (habit: Habit) => {
    setEditingId(habit.id);
  };

  const handleSaveGoals = (
    habitId: string,
    updates: {
      baseGoal?: number;
      currentGoal?: number;
      minGoal?: number;
      maxGoal?: number;
      shrinkThreshold?: number;
      growThreshold?: number;
    }
  ) => {
    updateHabit(habitId, updates);
    setEditingId(null);
  };

  const getGoalStatus = (habit: Habit) => {
    if (habit.currentGoal > habit.baseGoal) {
      return { status: "thriving", color: "text-success", icon: TrendingUp };
    } else if (habit.currentGoal < habit.baseGoal) {
      return { status: "adjusted", color: "text-warning", icon: TrendingDown };
    } else {
      return { status: "stable", color: "text-muted-foreground", icon: Target };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Goal Management</h1>
          <p className="text-muted-foreground">
            Review and adjust your adaptive goals
          </p>
        </div>

        {habits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 text-6xl">🎯</div>
              <h2 className="text-2xl font-semibold mb-2">No habits to manage</h2>
              <p className="text-muted-foreground max-w-md">
                Create some habits first, then come back here to fine-tune your goals!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const { status, color, icon: StatusIcon } = getGoalStatus(habit);
              const isEditing = editingId === habit.id;

              return (
                <Card key={habit.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {habit.title}
                          <Badge variant={status === "thriving" ? "default" : "secondary"}>
                            <StatusIcon className={cn("h-3 w-3 mr-1", color)} />
                            {status}
                          </Badge>
                        </CardTitle>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {habit.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isEditing ? (
                      <EditGoalsForm
                        habit={habit}
                        onSave={(updates) => handleSaveGoals(habit.id, updates)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <div className="space-y-4">
                        {/* Goal display */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Current Goal</Label>
                            <p className="text-2xl font-bold">
                              {habit.currentGoal} <span className="text-sm font-normal">{habit.unit}</span>
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Base Goal</Label>
                            <p className="text-2xl font-bold">
                              {habit.baseGoal} <span className="text-sm font-normal">{habit.unit}</span>
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Min Goal</Label>
                            <p className="text-2xl font-bold">
                              {habit.minGoal} <span className="text-sm font-normal">{habit.unit}</span>
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Max Goal</Label>
                            <p className="text-2xl font-bold">
                              {habit.maxGoal} <span className="text-sm font-normal">{habit.unit}</span>
                            </p>
                          </div>
                        </div>

                        {/* Thresholds */}
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                              Shrinks after {habit.shrinkThreshold} misses
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>
                              Grows after {habit.growThreshold} successes
                            </span>
                          </div>
                        </div>

                        {/* Streaks */}
                        <div className="flex gap-4 text-sm border-t pt-4">
                          {habit.successStreak > 0 && (
                            <Badge variant="outline" className="bg-success/10">
                              ✓ {habit.successStreak}/{habit.growThreshold} to grow
                            </Badge>
                          )}
                          {habit.missedStreak > 0 && (
                            <Badge variant="outline" className="bg-destructive/10">
                              ✗ {habit.missedStreak}/{habit.shrinkThreshold} to shrink
                            </Badge>
                          )}
                          {habit.currentStreak > 0 && (
                            <Badge variant="outline">
                              🔥 {habit.currentStreak} day streak
                            </Badge>
                          )}
                        </div>

                        <Button onClick={() => handleEditGoals(habit)} variant="outline" className="w-full sm:w-auto">
                          Adjust Goals
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

// Edit form component
function EditGoalsForm({
  habit,
  onSave,
  onCancel,
}: {
  habit: Habit;
  onSave: (updates: Partial<Habit>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState({
    baseGoal: habit.baseGoal,
    currentGoal: habit.currentGoal,
    minGoal: habit.minGoal,
    maxGoal: habit.maxGoal,
    shrinkThreshold: habit.shrinkThreshold,
    growThreshold: habit.growThreshold,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="baseGoal">Base Goal</Label>
          <Input
            id="baseGoal"
            type="number"
            min="1"
            value={values.baseGoal}
            onChange={(e) => setValues({ ...values, baseGoal: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="currentGoal">Current Goal</Label>
          <Input
            id="currentGoal"
            type="number"
            min="1"
            value={values.currentGoal}
            onChange={(e) => setValues({ ...values, currentGoal: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="minGoal">Min Goal</Label>
          <Input
            id="minGoal"
            type="number"
            min="1"
            value={values.minGoal}
            onChange={(e) => setValues({ ...values, minGoal: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="maxGoal">Max Goal</Label>
          <Input
            id="maxGoal"
            type="number"
            min="1"
            value={values.maxGoal}
            onChange={(e) => setValues({ ...values, maxGoal: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="shrinkThreshold">Misses to Shrink</Label>
          <Input
            id="shrinkThreshold"
            type="number"
            min="1"
            max="10"
            value={values.shrinkThreshold}
            onChange={(e) => setValues({ ...values, shrinkThreshold: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="growThreshold">Successes to Grow</Label>
          <Input
            id="growThreshold"
            type="number"
            min="1"
            max="10"
            value={values.growThreshold}
            onChange={(e) => setValues({ ...values, growThreshold: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default Goals;
