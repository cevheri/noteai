"use client";

import { useState, useEffect } from "react";
import {
  Bug,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  Eye,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface BugReport {
  id: number;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  userEmail: string | null;
  userId: string | null;
  url: string | null;
  userAgent: string | null;
  createdAt: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function BugReportsPage() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<BugReport | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/bug-reports", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data.bugReports);
      } else {
        toast.error("Failed to fetch bug reports");
      }
    } catch (error) {
      console.error("Failed to fetch bug reports:", error);
      toast.error("Failed to fetch bug reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bug-reports/${reportId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setReports(prev =>
          prev.map(r => (r.id === reportId ? { ...r, status: newStatus } : r))
        );
        toast.success("Status updated");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    try {
      const response = await fetch(`/api/admin/bug-reports/${reportId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setReports(prev => prev.filter(r => r.id !== reportId));
        toast.success("Report deleted");
      } else {
        toast.error("Failed to delete report");
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
      toast.error("Failed to delete report");
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            Open
          </Badge>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bug Reports</h1>
          <p className="text-muted-foreground">
            Review and manage user-submitted bug reports
          </p>
        </div>
        <Button onClick={fetchReports} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Bug className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No bug reports found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {report.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(report.severity)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReport(report);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report.id, "open")}
                          disabled={report.status === "open"}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Mark as Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report.id, "in_progress")}
                          disabled={report.status === "in_progress"}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report.id, "resolved")}
                          disabled={report.status === "resolved"}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(report.id, "closed")}
                          disabled={report.status === "closed"}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Close
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.status === "open").length}
              </p>
              <p className="text-sm text-muted-foreground">Open</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.status === "in_progress").length}
              </p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.status === "resolved").length}
              </p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.severity === "critical").length}
              </p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {getSeverityBadge(selectedReport.severity)}
                {getStatusBadge(selectedReport.status)}
                <Badge variant="outline">{selectedReport.type}</Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.userEmail && (
                <div>
                  <h4 className="font-medium mb-1">Reported By</h4>
                  <p className="text-muted-foreground">{selectedReport.userEmail}</p>
                </div>
              )}

              {selectedReport.url && (
                <div>
                  <h4 className="font-medium mb-1">Page URL</h4>
                  <p className="text-muted-foreground text-sm break-all">
                    {selectedReport.url}
                  </p>
                </div>
              )}

              {selectedReport.userAgent && (
                <div>
                  <h4 className="font-medium mb-1">Browser Info</h4>
                  <p className="text-muted-foreground text-sm break-all">
                    {selectedReport.userAgent}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-1">Submitted</h4>
                <p className="text-muted-foreground">
                  {formatDate(selectedReport.createdAt)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}