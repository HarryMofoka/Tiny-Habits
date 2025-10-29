import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Contact</h1>
      <Card><CardContent className="py-6">
        <p className="mb-4">Have questions or feedback? We'd love to hear from you!</p>
        <p className="text-muted-foreground">Email: support@tinyhabits.app</p>
      </CardContent></Card>
    </main>
  </div>
);

export default Contact;
