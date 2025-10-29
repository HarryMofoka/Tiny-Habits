import { Navigation } from "@/components/Navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible>
        <AccordionItem value="1">
          <AccordionTrigger>How do adaptive goals work?</AccordionTrigger>
          <AccordionContent>Goals shrink by 20% after consecutive misses and grow by 10% after consecutive successes.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>Is my data safe?</AccordionTrigger>
          <AccordionContent>All data is stored locally in your browser. Nothing is sent to servers.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger>Can I backup my data?</AccordionTrigger>
          <AccordionContent>Yes! Use the Export page to download your habits as JSON.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  </div>
);

export default FAQ;
