"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Calendar,
  Bug,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface AnalyticsData {
  totalUsers: number;
  totalNotes: number;
  totalBugReports: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newNotesThisWeek: number;
  proUsers: number;
  teamUsers: number;
  userGrowth: number;
  noteGrowth: number;
}

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/analytics", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        toast.error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to fetch analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    subtitle,
    color,
  }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    subtitle?: string;
    color: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(trend || subtitle) && (
              <div className="flex items-center gap-2 mt-1">
                {trend && trendValue && (
                  <span
                    className={`flex items-center text-xs ${
                      trend === "up"
                        ? "text-green-600"
                        : trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : trend === "down" ? (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    ) : null}
                    {trendValue}
                  </span>
                )}
                {subtitle && (
                  <span className="text-xs text-muted-foreground">{subtitle}</span>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Overview of application metrics and usage
          </p>
        </div>
        <Button onClick={fetchAnalytics} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analytics?.totalUsers ?? 0}
          icon={Users}
          trend={analytics?.userGrowth && analytics.userGrowth > 0 ? "up" : "neutral"}
          trendValue={analytics?.newUsersThisWeek ? `+${analytics.newUsersThisWeek} this week` : undefined}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Notes"
          value={analytics?.totalNotes ?? 0}
          icon={FileText}
          trend={analytics?.noteGrowth && analytics.noteGrowth > 0 ? "up" : "neutral"}
          trendValue={analytics?.newNotesThisWeek ? `+${analytics.newNotesThisWeek} this week` : undefined}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Active Users"
          value={analytics?.activeUsers ?? 0}
          icon={Activity}
          subtitle="Last 7 days"
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Bug Reports"
          value={analytics?.totalBugReports ?? 0}
          icon={Bug}
          subtitle="Total submitted"
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
      </div>

      {/* Subscription Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Free Users
            </CardTitle>
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {(analytics?.totalUsers ?? 0) - (analytics?.proUsers ?? 0) - (analytics?.teamUsers ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pro Users
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.proUsers ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Users
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Crown className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.teamUsers ?? 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Notes Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. Notes per User</span>
                <span className="font-medium">
                  {analytics?.totalUsers
                    ? (analytics.totalNotes / analytics.totalUsers).toFixed(1)
                    : "0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Conversion Rate (Pro)</span>
                <span className="font-medium">
                  {analytics?.totalUsers
                    ? (((analytics.proUsers ?? 0) / analytics.totalUsers) * 100).toFixed(1)
                    : "0"}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bug Reports Open</span>
                <span className="font-medium">{analytics?.totalBugReports ?? 0}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
