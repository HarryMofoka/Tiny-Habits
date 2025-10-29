import { Navigation } from "@/components/Navigation";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Configure your TinyHabits experience</p>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how TinyHabits looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Dark Mode</Label>
              <Switch id="theme" checked={isDark} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
