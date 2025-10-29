import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <Card><CardContent className="py-6 space-y-4">
        <p><strong>Privacy-First Approach</strong></p>
        <p>TinyHabits stores all data locally in your browser using LocalStorage. We do not collect, transmit, or store any personal data on external servers.</p>
        <p>Your habit data never leaves your device unless you explicitly export it.</p>
      </CardContent></Card>
    </main>
  </div>
);

export default Privacy;
