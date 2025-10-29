/**
 * Dashboard Page - Analytics & Progress Visualization
 * Charts showing streaks, success rates, and goal adaptations
 */

import { Navigation } from "@/components/Navigation";
import { useHabits } from "@/hooks/useHabits";
import { calculateHabitStats } from "@/utils/habitLogic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Award, Activity } from "lucide-react";

const Dashboard = () => {
  const { habits } = useHabits();

  // Calculate overall statistics
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce(
    (sum, h) => sum + h.completions.filter((c) => c.completed).length,
    0
  );
  const avgStreak = habits.length > 0
    ? habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length
    : 0;
  const totalAdaptations = habits.reduce((sum, h) => {
    const uniqueGoals = new Set(h.completions.map((c) => c.goalAtTime));
    return sum + uniqueGoals.size - 1;
  }, 0);

  // Prepare data for charts
  const habitStatsData = habits.map((h) => {
    const stats = calculateHabitStats(h);
    return {
      name: h.title.length > 15 ? h.title.slice(0, 15) + "..." : h.title,
      successRate: stats.successRate,
      completions: stats.totalCompletions,
      streak: h.currentStreak,
    };
  });

  const successVsMissData = habits.map((h) => {
    const completed = h.completions.filter((c) => c.completed).length;
    const missed = h.completions.filter((c) => !c.completed).length;
    return {
      name: h.title.length > 15 ? h.title.slice(0, 15) + "..." : h.title,
      Completed: completed,
      Missed: missed,
    };
  });

  // Overall success vs miss pie chart
  const totalCompleted = habits.reduce(
    (sum, h) => sum + h.completions.filter((c) => c.completed).length,
    0
  );
  const totalMissed = habits.reduce(
    (sum, h) => sum + h.completions.filter((c) => !c.completed).length,
    0
  );
  const pieData = [
    { name: "Completed", value: totalCompleted, color: "hsl(var(--success))" },
    { name: "Missed", value: totalMissed, color: "hsl(var(--destructive))" },
  ];

  // Goal adaptation data
  const adaptationData = habits.map((h) => ({
    name: h.title.length > 15 ? h.title.slice(0, 15) + "..." : h.title,
    current: h.currentGoal,
    base: h.baseGoal,
    min: h.minGoal,
    max: h.maxGoal,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and celebrate your wins
          </p>
        </div>

        {habits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 text-6xl">📊</div>
              <h2 className="text-2xl font-semibold mb-2">No data yet</h2>
              <p className="text-muted-foreground max-w-md">
                Start tracking habits to see beautiful charts and insights here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalHabits}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCompletions}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Streak</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgStreak.toFixed(1)} days</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Goal Adaptations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAdaptations}</div>
                </CardContent>
              </Card>
            </div>

            {/* Success rates */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rates by Habit</CardTitle>
                <CardDescription>Completion percentage for each habit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={habitStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successRate" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Streaks */}
            <Card>
              <CardHeader>
                <CardTitle>Current Streaks</CardTitle>
                <CardDescription>Active streak days for each habit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={habitStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="streak" stroke="hsl(var(--success))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success vs Miss */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Completions vs Misses</CardTitle>
                  <CardDescription>Breakdown by habit</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={successVsMissData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Completed" fill="hsl(var(--success))" />
                      <Bar dataKey="Missed" fill="hsl(var(--destructive))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Overall Completion</CardTitle>
                  <CardDescription>Total completed vs missed</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Goal adaptations */}
            <Card>
              <CardHeader>
                <CardTitle>Adaptive Goals</CardTitle>
                <CardDescription>Current vs base vs min/max goals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={adaptationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={3} name="Current Goal" />
                    <Line type="monotone" dataKey="base" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Base Goal" />
                    <Line type="monotone" dataKey="min" stroke="hsl(var(--destructive))" strokeDasharray="3 3" name="Min Goal" />
                    <Line type="monotone" dataKey="max" stroke="hsl(var(--success))" strokeDasharray="3 3" name="Max Goal" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
