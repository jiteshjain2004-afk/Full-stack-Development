import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateAdminPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@duniyamart.com");
  const [password, setPassword] = useState("Admin@123456");
  const [fullName, setFullName] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const createAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Step 1: Sign up the user
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "admin",
          },
        },
      });

      if (signupError) throw signupError;

      if (!signupData.user) {
        throw new Error("User creation failed");
      }

      // Wait a bit for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Verify and add admin role if not exists
      const { data: existingRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", signupData.user.id);

      const hasAdminRole = existingRoles?.some(r => r.role === "admin");

      if (!hasAdminRole) {
        // Add admin role manually
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: signupData.user.id,
            role: "admin",
          });

        if (roleError && !roleError.message.includes("duplicate")) {
          console.error("Role error:", roleError);
        }
      }

      // Step 3: Also add buyer role (default)
      const hasBuyerRole = existingRoles?.some(r => r.role === "buyer");
      if (!hasBuyerRole) {
        await supabase
          .from("user_roles")
          .insert({
            user_id: signupData.user.id,
            role: "buyer",
          })
          .then(() => {});
      }

      setResult({
        success: true,
        message: `Admin created successfully! Email: ${email}, Password: ${password}`,
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Failed to create admin",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8 text-center">
        <Shield className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="font-display text-3xl font-bold mb-2">Create Admin User</h1>
        <p className="text-muted-foreground">
          Create an admin account to manage sellers and approvals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
          <CardDescription>
            Fill in the details below to create an admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Admin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@duniyamart.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin@123456"
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters
            </p>
          </div>

          <Button
            onClick={createAdmin}
            disabled={loading || !email || !password || !fullName}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Admin...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Create Admin
              </>
            )}
          </Button>

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
                  <div className="mt-3 space-y-2">
                    <p className="font-semibold">Next Steps:</p>
                    <ol className="list-decimal list-inside text-sm space-y-1">
                      <li>Logout if you're currently logged in</li>
                      <li>Go to Login page</li>
                      <li>Login with the admin credentials above</li>
                      <li>Access admin dashboard at /admin/dashboard</li>
                    </ol>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/login")}
                      className="mt-2"
                    >
                      Go to Login
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Default Admin Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-muted rounded">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono">admin@duniyamart.com</span>
          </div>
          <div className="flex justify-between p-2 bg-muted rounded">
            <span className="text-muted-foreground">Password:</span>
            <span className="font-mono">Admin@123456</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            💡 Tip: You can change these credentials above before creating the admin
          </p>
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
