import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function TestAdminPage() {
  const { user, roles, isAdmin, isSeller, isBuyer, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 text-center">
        <Shield className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="font-display text-3xl font-bold mb-2">Admin Status Check</h1>
        <p className="text-muted-foreground">
          Check if you have admin access
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current User Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <div className="text-center py-8">
              <XCircle className="mx-auto mb-3 h-12 w-12 text-destructive" />
              <p className="font-semibold mb-2">Not Logged In</p>
              <p className="text-sm text-muted-foreground mb-4">
                Please login first to check admin status
              </p>
              <Button onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-mono text-sm">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs">{user.id}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-sm">Roles:</p>
                {roles.length === 0 ? (
                  <Badge variant="destructive">No roles assigned</Badge>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {roles.map(role => (
                      <Badge key={role} variant="default">{role}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg text-center ${isAdmin ? 'bg-green-100 border-2 border-green-500' : 'bg-muted'}`}>
                  {isAdmin ? (
                    <CheckCircle className="mx-auto mb-1 h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="mx-auto mb-1 h-6 w-6 text-muted-foreground" />
                  )}
                  <p className="text-xs font-semibold">Admin</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${isSeller ? 'bg-blue-100 border-2 border-blue-500' : 'bg-muted'}`}>
                  {isSeller ? (
                    <CheckCircle className="mx-auto mb-1 h-6 w-6 text-blue-600" />
                  ) : (
                    <XCircle className="mx-auto mb-1 h-6 w-6 text-muted-foreground" />
                  )}
                  <p className="text-xs font-semibold">Seller</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${isBuyer ? 'bg-purple-100 border-2 border-purple-500' : 'bg-muted'}`}>
                  {isBuyer ? (
                    <CheckCircle className="mx-auto mb-1 h-6 w-6 text-purple-600" />
                  ) : (
                    <XCircle className="mx-auto mb-1 h-6 w-6 text-muted-foreground" />
                  )}
                  <p className="text-xs font-semibold">Buyer</p>
                </div>
              </div>

              {isAdmin ? (
                <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-semibold text-green-900">You are an Admin! ✅</p>
                  </div>
                  <p className="text-sm text-green-800 mb-3">
                    You have full admin access to the dashboard
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate("/admin/dashboard")} size="sm">
                      Go to Admin Dashboard
                    </Button>
                    <Button onClick={() => navigate("/admin/approvals")} variant="outline" size="sm">
                      Seller Approvals
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <p className="font-semibold text-red-900">Not an Admin ❌</p>
                  </div>
                  <p className="text-sm text-red-800 mb-3">
                    You don't have admin role. Use the button below to become admin.
                  </p>
                  <Button onClick={() => navigate("/make-admin")} size="sm">
                    Make Me Admin
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
