import "./ProductCard.css";

function ProductCard(props) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={props.image} alt={props.name} />
      </div>

      <h2 className="product-name">{props.name}</h2>
      <p className="price">${props.price}</p>

      {props.inStock ? (
        <span className="stock in">In Stock</span>
      ) : (
        <span className="stock out">Out of Stock</span>
      )}
    </div>
  );
}

export default ProductCard;
