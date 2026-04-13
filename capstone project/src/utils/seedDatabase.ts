// Database seeding utility
// Run this from browser console or create a temporary admin page
import { supabase } from "@/integrations/supabase/client";

export async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Add Categories
    console.log("📁 Adding categories...");
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .upsert([
        { name: "Fruits & Vegetables", slug: "fruits-vegetables", icon: "🥬" },
        { name: "Dairy Products", slug: "dairy", icon: "🥛" },
        { name: "Grains & Pulses", slug: "grains-pulses", icon: "🌾" },
        { name: "Spices", slug: "spices", icon: "🌶️" },
        { name: "Oils & Ghee", slug: "oils-ghee", icon: "🛢️" },
        { name: "Tea & Beverages", slug: "tea-beverages", icon: "☕" },
      ], { onConflict: "slug" })
      .select();

    if (catError) {
      console.error("❌ Categories error:", catError);
      return { success: false, error: catError };
    }
    console.log("✅ Categories added:", categories?.length);

    // 2. Add Coupons
    console.log("🎟️ Adding coupons...");
    const { data: coupons, error: couponError } = await supabase
      .from("coupons")
      .upsert([
        {
          code: "WELCOME10",
          description: "Welcome offer - 10% off on first order",
          discount_type: "percentage",
          discount_value: 10,
          min_order_value: 500,
          max_uses: 100,
          is_active: true,
          expires_at: "2026-12-31T23:59:59Z",
        },
        {
          code: "SAVE100",
          description: "Flat ₹100 off on orders above ₹1000",
          discount_type: "flat",
          discount_value: 100,
          min_order_value: 1000,
          max_uses: 200,
          is_active: true,
          expires_at: "2026-12-31T23:59:59Z",
        },
        {
          code: "BULK20",
          description: "20% off on bulk orders above ₹5000",
          discount_type: "percentage",
          discount_value: 20,
          min_order_value: 5000,
          max_uses: 50,
          is_active: true,
          expires_at: "2026-12-31T23:59:59Z",
        },
      ], { onConflict: "code" })
      .select();

    if (couponError) {
      console.error("❌ Coupons error:", couponError);
      return { success: false, error: couponError };
    }
    console.log("✅ Coupons added:", coupons?.length);

    console.log("🎉 Database seeded successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Sign up as a seller in your app");
    console.log("2. Add products through the seller dashboard");
    console.log("3. Test checkout with coupons: WELCOME10, SAVE100, BULK20");

    return { 
      success: true, 
      categories: categories?.length || 0,
      coupons: coupons?.length || 0,
    };
  } catch (error) {
    console.error("❌ Seed failed:", error);
    return { success: false, error };
  }
}

// Helper to check current database state
export async function checkDatabase() {
  console.log("🔍 Checking database...");

  const { data: categories } = await supabase.from("categories").select("name");
  const { data: sellers } = await supabase.from("sellers").select("business_name, status");
  const { data: products } = await supabase.from("products").select("name, status");
  const { data: coupons } = await supabase.from("coupons").select("code, is_active");

  console.log("\n📊 Database Status:");
  console.log("Categories:", categories?.length || 0);
  console.log("Sellers:", sellers?.length || 0);
  console.log("Products:", products?.length || 0);
  console.log("Coupons:", coupons?.length || 0);

  if (categories?.length) {
    console.log("\n📁 Categories:", categories.map(c => c.name).join(", "));
  }

  if (coupons?.length) {
    console.log("\n🎟️ Active Coupons:", coupons.filter(c => c.is_active).map(c => c.code).join(", "));
  }

  if (sellers?.length) {
    console.log("\n🏪 Sellers:", sellers.map(s => `${s.business_name} (${s.status})`).join(", "));
  }

  if (products?.length) {
    console.log("\n📦 Products:", products.filter(p => p.status === 'active').length, "active");
  }

  return { categories, sellers, products, coupons };
}
