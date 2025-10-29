/**
 * AddHabitModal Component
 * Modal dialog for creating and editing habits
 */

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Habit } from "@/types/habit";

interface AddHabitModalProps {
  onSubmit: (habitData: HabitFormData) => void;
  editHabit?: Habit | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export interface HabitFormData {
  title: string;
  description?: string;
  baseGoal: number;
  currentGoal: number;
  minGoal: number;
  maxGoal: number;
  unit: string;
  shrinkThreshold: number;
  growThreshold: number;
  category?: string;
  color?: string;
}

const defaultFormData: HabitFormData = {
  title: "",
  description: "",
  baseGoal: 10,
  currentGoal: 10,
  minGoal: 5,
  maxGoal: 20,
  unit: "minutes",
  shrinkThreshold: 2,
  growThreshold: 3,
  category: "",
  color: "#14B8A6",
};

export function AddHabitModal({
  onSubmit,
  editHabit,
  open,
  onOpenChange,
  trigger,
}: AddHabitModalProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [formData, setFormData] = useState<HabitFormData>(defaultFormData);

  // Sync external open state
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  // Load edit data
  useEffect(() => {
    if (editHabit) {
      setFormData({
        title: editHabit.title,
        description: editHabit.description,
        baseGoal: editHabit.baseGoal,
        currentGoal: editHabit.currentGoal,
        minGoal: editHabit.minGoal,
        maxGoal: editHabit.maxGoal,
        unit: editHabit.unit,
        shrinkThreshold: editHabit.shrinkThreshold,
        growThreshold: editHabit.growThreshold,
        category: editHabit.category,
        color: editHabit.color,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editHabit]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      setFormData(defaultFormData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      return;
    }

    onSubmit(formData);
    handleOpenChange(false);
  };

  const updateField = (field: keyof HabitFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="gap-2 shadow-lg animate-bounce-in">
            <Plus className="h-5 w-5" />
            Add Habit
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editHabit ? "Edit Habit" : "Create New Habit"}
            </DialogTitle>
            <DialogDescription>
              Set up your habit with adaptive goals that adjust to your performance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Habit Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g., Read, Exercise, Meditate"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Add more details about this habit..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => updateField("unit", e.target.value)}
                  placeholder="e.g., minutes, pages, reps"
                />
              </div>
            </div>

            {/* Goal settings */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-sm">Goal Settings</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="baseGoal">Base Goal *</Label>
                  <Input
                    id="baseGoal"
                    type="number"
                    min="1"
                    value={formData.baseGoal}
                    onChange={(e) => updateField("baseGoal", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Your target</p>
                </div>

                <div>
                  <Label htmlFor="currentGoal">Starting Goal</Label>
                  <Input
                    id="currentGoal"
                    type="number"
                    min="1"
                    value={formData.currentGoal}
                    onChange={(e) => updateField("currentGoal", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Where to begin</p>
                </div>

                <div>
                  <Label htmlFor="minGoal">Minimum Goal</Label>
                  <Input
                    id="minGoal"
                    type="number"
                    min="1"
                    value={formData.minGoal}
                    onChange={(e) => updateField("minGoal", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Safety floor</p>
                </div>

                <div>
                  <Label htmlFor="maxGoal">Maximum Goal</Label>
                  <Input
                    id="maxGoal"
                    type="number"
                    min="1"
                    value={formData.maxGoal}
                    onChange={(e) => updateField("maxGoal", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Ceiling</p>
                </div>
              </div>
            </div>

            {/* Adaptation settings */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-sm">Adaptation Thresholds</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shrinkThreshold">Misses to Shrink</Label>
                  <Input
                    id="shrinkThreshold"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.shrinkThreshold}
                    onChange={(e) => updateField("shrinkThreshold", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Goal shrinks by 20% after this many misses
                  </p>
                </div>

                <div>
                  <Label htmlFor="growThreshold">Successes to Grow</Label>
                  <Input
                    id="growThreshold"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.growThreshold}
                    onChange={(e) => updateField("growThreshold", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Goal grows by 10% after this many successes
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editHabit ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
