import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle, XCircle, Clock, Eye, RefreshCw } from "lucide-react";

type ApplicationStatus = "pending" | "approved" | "rejected";

interface SellerApplication {
  id: string;
  user_id: string;
  business_name: string;
  gstin: string | null;
  category: string | null;
  address: string | null;
  description: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === "approved") return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
  if (status === "rejected") return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
}

export default function AdminApprovalsPage() {
  const { isAdmin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [authLoading, isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchApplications();
  }, [isAdmin]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("seller_applications")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      toast({ title: "Failed to load applications", description: error.message, variant: "destructive" });
    } else {
      setApplications((data || []) as SellerApplication[]);
    }
    setLoading(false);
  };

  const handleApprove = async (app: SellerApplication) => {
    setActionLoading(true);
    try {
      const { error } = await supabase.rpc("approve_seller_application" as any, {
        _application_id: app.id,
        _admin_id: user!.id,
      });

      if (error) throw error;

      toast({ title: "Seller approved ✓", description: `${app.business_name} can now sell on Duniya Mart.` });
      setViewDialogOpen(false);
      fetchApplications();
    } catch (err: any) {
      // Fallback: manually update if RPC not available yet
      await supabase.from("seller_applications")
        .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: user!.id })
        .eq("id", app.id);

      // Upsert into sellers
      await supabase.from("sellers").upsert({
        user_id: app.user_id,
        business_name: app.business_name,
        gstin: app.gstin,
        category: app.category,
        address: app.address,
        description: app.description,
        status: "approved",
        verified: true,
      }, { onConflict: "user_id" });

      // Grant seller role
      await supabase.from("user_roles").upsert(
        { user_id: app.user_id, role: "seller" },
        { onConflict: "user_id,role" }
      );

      toast({ title: "Seller approved ✓", description: `${app.business_name} can now sell on Duniya Mart.` });
      setViewDialogOpen(false);
      fetchApplications();
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.rpc("reject_seller_application" as any, {
        _application_id: selectedApp.id,
        _admin_id: user!.id,
        _notes: rejectNotes || null,
      });

      if (error) throw error;

      toast({ title: "Application rejected", description: `${selectedApp.business_name}'s application has been rejected.` });
    } catch {
      // Fallback
      await supabase.from("seller_applications")
        .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: user!.id, admin_notes: rejectNotes || null })
        .eq("id", selectedApp.id);

      await supabase.from("sellers")
        .update({ status: "rejected", verified: false })
        .eq("user_id", selectedApp.user_id);

      toast({ title: "Application rejected" });
    }

    setRejectDialogOpen(false);
    setViewDialogOpen(false);
    setRejectNotes("");
    setSelectedApp(null);
    fetchApplications();
    setActionLoading(false);
  };

  const filtered = applications.filter(app => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch = app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.gstin || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  if (authLoading) return <div className="flex min-h-[60vh] items-center justify-center"><p>Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Seller Approvals</h1>
            <p className="text-sm text-muted-foreground">Review and manage seller applications</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
            ← Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {([
          { label: "Total", value: counts.all, color: "text-foreground", icon: Clock },
          { label: "Pending", value: counts.pending, color: "text-yellow-600", icon: Clock },
          { label: "Approved", value: counts.approved, color: "text-green-600", icon: CheckCircle },
          { label: "Rejected", value: counts.rejected, color: "text-red-600", icon: XCircle },
        ] as const).map(s => (
          <Card key={s.label} className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setFilter(s.label.toLowerCase() as any)}>
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className={`h-7 w-7 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-display text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by business name or GSTIN..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "approved", "rejected"] as const).map(f => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f} {f === "all" ? `(${counts.all})` : f === "pending" ? `(${counts.pending})` : f === "approved" ? `(${counts.approved})` : `(${counts.rejected})`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "all" ? "All Applications" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Applications`}
            <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">Loading applications...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No applications found</p>
              {filter !== "all" && (
                <Button variant="link" size="sm" onClick={() => setFilter("all")}>Show all</Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>GSTIN</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(app => (
                    <TableRow key={app.id} className="group">
                      <TableCell className="font-medium">{app.business_name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{app.gstin || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{app.category || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(app.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell><StatusBadge status={app.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setSelectedApp(app); setViewDialogOpen(true); }}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" /> View
                          </Button>
                          {app.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app)}
                                disabled={actionLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => { setSelectedApp(app); setRejectDialogOpen(true); }}
                                disabled={actionLoading}
                              >
                                <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">{selectedApp.business_name}</h2>
                <StatusBadge status={selectedApp.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">GSTIN</Label>
                  <p className="font-mono">{selectedApp.gstin || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p>{selectedApp.category || "Not provided"}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <p>{selectedApp.address || "Not provided"}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-muted-foreground">{selectedApp.description || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Submitted</Label>
                  <p>{new Date(selectedApp.submitted_at).toLocaleString("en-IN")}</p>
                </div>
                {selectedApp.reviewed_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Reviewed</Label>
                    <p>{new Date(selectedApp.reviewed_at).toLocaleString("en-IN")}</p>
                  </div>
                )}
                {selectedApp.admin_notes && (
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Admin Notes</Label>
                    <p className="rounded-md bg-muted p-2 text-sm">{selectedApp.admin_notes}</p>
                  </div>
                )}
              </div>
              {selectedApp.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(selectedApp)}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Seller
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => { setRejectDialogOpen(true); }}
                    disabled={actionLoading}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You are rejecting <strong>{selectedApp?.business_name}</strong>'s seller application.
              Optionally provide a reason.
            </p>
            <div>
              <Label>Reason / Notes (optional)</Label>
              <Textarea
                placeholder="e.g. Incomplete documentation, invalid GSTIN..."
                value={rejectNotes}
                onChange={e => setRejectNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={actionLoading}>
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
