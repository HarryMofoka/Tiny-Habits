import { Navigation } from "@/components/Navigation";
import { useHabits } from "@/hooks/useHabits";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Motivation = () => {
  const { habits } = useHabits();

  const messages = [
    "Every small step counts! 🌟",
    "You're building lasting change, one day at a time.",
    "Progress, not perfection. Keep going! 💪",
    "Your future self will thank you for starting today.",
    "Consistency is the secret ingredient to success.",
    "Small habits, big results. You've got this!",
  ];

  const getPersonalizedMessage = () => {
    const totalStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    if (totalStreak > 20) return "You're on fire! 🔥 Your consistency is incredible!";
    if (totalStreak > 10) return "Amazing streak! Keep up the momentum! ⭐";
    if (totalStreak > 5) return "Great progress! You're building real momentum! 🚀";
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Motivation</h1>
        <p className="text-muted-foreground mb-8">Your personal habit coach</p>

        <Card className="bg-gradient-primary text-primary-foreground mb-6">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <p className="text-2xl font-semibold animate-fade-in">{getPersonalizedMessage()}</p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {messages.map((msg, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="py-6 text-center">{msg}</CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Motivation;
