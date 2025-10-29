/**
 * HabitCard - Interactive card component for habit tracking
 * 
 * Displays a single habit with:
 * - Progress towards adaptive goals
 * - Visual feedback for streaks and goal changes
 * - Quick actions (complete/miss/edit/delete)
 * - Real-time status indicators
 * 
 * Uses adaptive UI to encourage consistent habit building while
 * maintaining flexibility when users struggle.
 */

import { useState } from "react";
import { CheckCircle2, XCircle, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Habit } from "@/types/habit";
import { isCompletedToday } from "@/utils/habitLogic";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onMiss: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({
  habit,
  onComplete,
  onMiss,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompleted = isCompletedToday(habit);
  
  // Calculate progress toward base goal
  const progress = Math.min((habit.currentGoal / habit.baseGoal) * 100, 100);
  
  // Determine if goal has been adapted
  const goalChanged = habit.currentGoal !== habit.baseGoal;
  const goalIncreased = habit.currentGoal > habit.baseGoal;

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(habit.id);
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        isCompleted && "border-success bg-success/5"
      )}
    >
      {/* Goal adaptation indicator */}
      {goalChanged && (
        <div
          className={cn(
            "absolute top-0 right-0 h-1 w-full",
            goalIncreased ? "bg-gradient-success" : "bg-gradient-to-r from-warning to-destructive"
          )}
        />
      )}

      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{habit.title}</h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            )}
          </div>
          
          {/* Streak badge */}
          {habit.currentStreak > 0 && (
            <Badge variant="secondary" className="ml-2 animate-bounce-in">
              🔥 {habit.currentStreak}
            </Badge>
          )}
        </div>

        {/* Goal display */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Goal</span>
            <div className="flex items-center gap-2">
              {goalChanged && (
                <>
                  {goalIncreased ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-warning" />
                  )}
                </>
              )}
              <span className="font-semibold">
                {habit.currentGoal} {habit.unit}
              </span>
            </div>
          </div>

          {/* Progress bar toward base goal */}
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {habit.minGoal}</span>
              <span>Base: {habit.baseGoal}</span>
              <span>Max: {habit.maxGoal}</span>
            </div>
          </div>
        </div>

        {/* Adaptive streaks display */}
        <div className="flex gap-4 text-xs text-muted-foreground mb-4">
          {habit.successStreak > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-success">✓</span>
              <span>{habit.successStreak}/{habit.growThreshold} to grow</span>
            </div>
          )}
          {habit.missedStreak > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-destructive">✗</span>
              <span>{habit.missedStreak}/{habit.shrinkThreshold} to shrink</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {!isCompleted ? (
          <>
            <Button
              onClick={() => onComplete(habit.id)}
              className="flex-1 gap-2"
              variant="default"
            >
              <CheckCircle2 className="h-4 w-4" />
              Done
            </Button>
            <Button
              onClick={() => onMiss(habit.id)}
              variant="outline"
              className="flex-1 gap-2"
            >
              <XCircle className="h-4 w-4" />
              Miss
            </Button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 text-success font-medium">
            <CheckCircle2 className="h-5 w-5" />
            Completed today!
          </div>
        )}

        <Button
          onClick={() => onEdit(habit)}
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleDelete}
          variant="ghost"
          size="icon"
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-all",
            isDeleting && "opacity-100 text-destructive"
          )}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
