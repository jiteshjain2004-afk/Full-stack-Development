import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertCircle, Loader2, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function MakeAdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setResult({ success: false, message: "Please login first!" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Add admin role to current user
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({
          user_id: user.id,
          role: "admin",
        }, { onConflict: "user_id,role" });

      if (roleError) throw roleError;

      setResult({
        success: true,
        message: "You are now an admin! Refresh the page to see admin features.",
      });

      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Failed to add admin role",
      });
    } finally {
      setLoading(false);
    }
  };

  const makeUserAdminByEmail = async () => {
    if (!email.trim()) {
      setResult({ success: false, message: "Please enter an email" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Find user by email from profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("id", `%${email}%`)
        .limit(1);

      if (profileError) throw profileError;

      // Try to find by auth.users metadata (this won't work directly, so we'll use a workaround)
      // For now, let's just show instructions
      setResult({
        success: false,
        message: "To make another user admin, they need to login first and use 'Make Me Admin' button, or you need their User ID.",
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Failed to find user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 text-center">
        <UserCog className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="font-display text-3xl font-bold mb-2">Make Admin</h1>
        <p className="text-muted-foreground">
          Add admin role to existing users
        </p>
      </div>

      {/* Make Current User Admin */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Make Me Admin</CardTitle>
          <CardDescription>
            {user ? `Add admin role to your account (${user.email})` : "Please login first"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This will add admin role to your current account: <strong>{user.email}</strong>
                </AlertDescription>
              </Alert>

              <Button
                onClick={makeCurrentUserAdmin}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Admin Role...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Make Me Admin
                  </>
                )}
              </Button>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please login first to make yourself admin.
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="ml-2"
                >
                  Go to Login
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.message}
                {result.success && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Page will refresh automatically...</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold mb-2">Option 1: Make Yourself Admin</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Login with your account</li>
              <li>Come to this page</li>
              <li>Click "Make Me Admin" button</li>
              <li>Page will refresh</li>
              <li>You're now admin!</li>
            </ol>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold mb-2">Option 2: Create New Admin</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Go to /create-admin page</li>
              <li>Create admin account</li>
              <li>Login with admin credentials</li>
            </ol>
          </div>

          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-xs">
              💡 <strong>Tip:</strong> If you already have an account, use "Make Me Admin" button above. 
              If you need a fresh admin account, use the /create-admin page.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
