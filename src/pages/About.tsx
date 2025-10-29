import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">About TinyHabits</h1>
      <Card><CardContent className="py-6 prose dark:prose-invert">
        <p>TinyHabits is an adaptive habit tracker that meets you where you are. Goals automatically adjust based on your performance - shrinking when you struggle, growing when you succeed.</p>
        <p className="mt-4">Version 1.0 | Built with React, TypeScript & Tailwind CSS</p>
      </CardContent></Card>
    </main>
  </div>
);

export default About;
