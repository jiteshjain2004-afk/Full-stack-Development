import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SignupPage() {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password, {
      full_name: fullName,
      role,
      business_name: role === "seller" ? businessName : undefined,
    });

    if (error) {
      toast({
        title: "Signup failed",
        description: error.message?.includes("already registered")
          ? "This email is already registered. Try logging in."
          : "Could not create account. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // If registering as seller, create a seller_application record
    if (role === "seller") {
      // Wait briefly for the auth trigger to create the user record
      await new Promise(r => setTimeout(r, 1500));
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from("seller_applications").upsert({
          user_id: session.user.id,
          business_name: businessName,
          gstin: gstin || null,
          category: category || null,
          address: address || null,
          description: description || null,
          status: "pending",
        }, { onConflict: "user_id" });
      }

      toast({
        title: "Application submitted! 🎉",
        description: "Your seller application is pending admin review. You'll be notified once approved.",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }

    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="mx-auto w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">D</div>
          <h1 className="font-display text-xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join Duniya Mart today</p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {(["buyer", "seller"] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-all ${role === r ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"}`}
            >
              {r === "buyer" ? "🛒 Buyer" : "🏭 Seller"}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Full Name</Label>
            <Input placeholder="Your name" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>

          {role === "seller" && (
            <>
              <div>
                <Label>Business Name</Label>
                <Input placeholder="Your business name" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
              </div>
              <div>
                <Label>GSTIN <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input placeholder="22AAAAA0000A1Z5" value={gstin} onChange={e => setGstin(e.target.value)} />
              </div>
              <div>
                <Label>Category <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input placeholder="e.g. Vegetables, Spices, Dairy" value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div>
                <Label>Business Address <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input placeholder="City, State" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div>
                <Label>Business Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea placeholder="Tell us about your products..." value={description} onChange={e => setDescription(e.target.value)} rows={2} />
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                ⏳ Your seller application will be <strong>reviewed by an admin</strong> before your store goes live.
              </div>
            </>
          )}

          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button className="w-full" disabled={loading}>
            {loading ? "Creating account..." : role === "buyer" ? "Create Buyer Account" : "Submit Seller Application"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
