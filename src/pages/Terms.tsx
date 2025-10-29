import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <Card><CardContent className="py-6 space-y-4">
        <p>By using TinyHabits, you agree to use the app as-is. All data is stored locally and we are not responsible for data loss.</p>
        <p>We recommend regularly exporting your habit data as backup.</p>
      </CardContent></Card>
    </main>
  </div>
);

export default Terms;
