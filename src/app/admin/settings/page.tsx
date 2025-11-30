"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Database,
  Mail,
  Lock,
  Globe,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "NotesAI",
    siteDescription: "AI-Powered Note Taking Application",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxNotesPerUser: 100,
    maxAIRequestsPerMonth: 50,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic application configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, siteName: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  siteDescription: e.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Security and access control options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, only admins can access the application
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, maintenanceMode: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>User Registration</Label>
              <p className="text-sm text-muted-foreground">
                Allow new users to create accounts
              </p>
            </div>
            <Switch
              checked={settings.registrationEnabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, registrationEnabled: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications to admins for important events
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Limits Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Usage Limits
          </CardTitle>
          <CardDescription>
            Configure default limits for free users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="maxNotes">Max Notes per User (Free)</Label>
              <Input
                id="maxNotes"
                type="number"
                value={settings.maxNotesPerUser}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxNotesPerUser: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxAI">Max AI Requests per Month (Free)</Label>
              <Input
                id="maxAI"
                type="number"
                value={settings.maxAIRequestsPerMonth}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxAIRequestsPerMonth: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: These are display values. Actual limits are managed through the Autumn payment configuration.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Lock className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Clear All User Data</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete all user accounts and their data
              </p>
            </div>
            <Button variant="destructive" disabled>
              Clear All Data
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Reset Database</p>
              <p className="text-sm text-muted-foreground">
                Reset database to initial state
              </p>
            </div>
            <Button variant="destructive" disabled>
              Reset Database
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
