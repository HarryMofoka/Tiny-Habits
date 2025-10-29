import { Navigation } from "@/components/Navigation";
import { useHabits } from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Export = () => {
  const { habits, exportHabits, importHabits, clearAllHabits } = useHabits();

  const handleExport = () => {
    const data = exportHabits();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tinyhabits-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importHabits(data);
      } catch {
        toast({ title: "Import failed", description: "Invalid file format", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Export & Import</h1>
        <p className="text-muted-foreground mb-8">Backup and restore your habit data</p>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Download your habits as JSON</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExport} disabled={habits.length === 0} className="gap-2">
                <Download className="h-4 w-4" />
                Export Habits
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>Restore from a backup file</CardDescription>
            </CardHeader>
            <CardContent>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import" />
              <Button onClick={() => document.getElementById("import")?.click()} variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Import Habits
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>This action cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={clearAllHabits} variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Export;
