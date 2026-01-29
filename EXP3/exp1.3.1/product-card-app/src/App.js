import ProductCard from "./components/ProductCard";

function App() {
  return (
    <div style={{ display: "flex", gap: "25px", padding: "30px" }}>
      <ProductCard
        name="Wireless Headphones"
        price="129.99"
        inStock={true}
        image="https://images.unsplash.com/photo-1585386959984-a41552231693"
      />

      <ProductCard
        name="Mechanical Keyboard"
        price="89.99"
        inStock={false}
        image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
      />

      <ProductCard
        name="Smart Watch"
        price="199.99"
        inStock={true}
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
      />
    </div>
  );
}

export default App;
