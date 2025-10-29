import { Navigation } from "@/components/Navigation";
import { useHabits } from "@/hooks/useHabits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Trends = () => {
  const { habits } = useHabits();

  // Get last 30 days of data
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const days = getLast30Days();
  const trendData = days.map((date) => {
    const dataPoint: any = { date: date.slice(5) }; // MM-DD format
    habits.forEach((habit) => {
      const completion = habit.completions.find((c) => c.date === date);
      dataPoint[habit.title] = completion?.completed ? 1 : 0;
    });
    return dataPoint;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Trends</h1>
        <p className="text-muted-foreground mb-8">Your habit consistency over time</p>

        {habits.length === 0 ? (
          <Card><CardContent className="py-20 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-semibold mb-2">No trends yet</h2>
            <p className="text-muted-foreground">Start tracking habits to see trends!</p>
          </CardContent></Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>30-Day Habit Completion</CardTitle>
              <CardDescription>Daily completion status (1 = done, 0 = missed/not logged)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {habits.map((habit, idx) => (
                    <Line key={habit.id} type="monotone" dataKey={habit.title} stroke={`hsl(${idx * 60}, 70%, 50%)`} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Trends;
