import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { seedDatabase, checkDatabase } from "@/utils/seedDatabase";
import { CheckCircle, Database, Loader2, AlertCircle } from "lucide-react";

export default function SeedDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await seedDatabase();
      setResult(res);
      if (res.success) {
        // Refresh status after seeding
        const status = await checkDatabase();
        setDbStatus(status);
      }
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    setLoading(true);
    try {
      const status = await checkDatabase();
      setDbStatus(status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Database Setup</h1>
        <p className="text-muted-foreground">
          Seed your database with categories and coupons to enable checkout functionality
        </p>
      </div>

      <div className="grid gap-6">
        {/* Seed Database Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Seed Database
            </CardTitle>
            <CardDescription>
              Add categories and test coupons to your database. This is safe to run multiple times.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button onClick={handleSeed} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  "Seed Database"
                )}
              </Button>
              <Button variant="outline" onClick={handleCheck} disabled={loading}>
                Check Status
              </Button>
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {result.success ? (
                    <div>
                      <p className="font-semibold mb-2">✅ Database seeded successfully!</p>
                      <ul className="text-sm space-y-1">
                        <li>• {result.categories} categories added</li>
                        <li>• {result.coupons} coupons added</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold mb-1">❌ Seeding failed</p>
                      <p className="text-sm">{result.error?.message || "Unknown error"}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Database Status Card */}
        {dbStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{dbStatus.categories?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{dbStatus.sellers?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Sellers</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{dbStatus.products?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{dbStatus.coupons?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Coupons</div>
                </div>
              </div>

              {dbStatus.coupons?.length > 0 && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                  <p className="font-semibold mb-2">🎟️ Available Coupons:</p>
                  <div className="space-y-1 text-sm">
                    {dbStatus.coupons.filter((c: any) => c.is_active).map((c: any) => (
                      <div key={c.code} className="font-mono">{c.code}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold min-w-6">1.</span>
                <span>Click "Seed Database" above to add categories and coupons</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold min-w-6">2.</span>
                <span>Sign up as a seller (or use existing seller account)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold min-w-6">3.</span>
                <span>Go to Seller Dashboard and add products with images and pricing</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold min-w-6">4.</span>
                <span>Browse products as a buyer and add them to cart</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold min-w-6">5.</span>
                <span>Test checkout with coupons: WELCOME10, SAVE100, BULK20</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
