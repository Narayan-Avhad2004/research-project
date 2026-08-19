import { Package, Store } from "lucide-react";

import ExpiryTimer from "./ExpiryTimer";

import "../styles/components/product-card.css";

const ProductCard = ({ product }) => {
  if (!product) {
    return null;
  }

  const remainingStock =
    Math.max(
      product.stock - product.actualSales,
      0
    );

  const salesDifference =
    product.predictedSales -
    product.actualSales;

  const lowSales =
    product.actualSales <
    product.predictedSales;

  return (
    <div className="product-card">

      {/* Product Image */}

      <div className="product-image-wrapper">

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <span className="product-category">
          {product.category}
        </span>

      </div>

      {/* Product Details */}

      <div className="product-card-body">

        <div className="product-title-row">

          <div className="product-name-section">

            <h3>
              {product.name}
            </h3>

            <div className="product-store">

              <Store size={12} />

              <span>
                {product.store}
              </span>

            </div>

          </div>

          <strong className="product-price">
            ₹{product.price}
          </strong>

        </div>

        {/* Statistics */}

        <div className="product-stat-grid">

          <div className="product-stat">
            <span>Stock</span>
            <strong>
              {product.stock}
            </strong>
          </div>

          <div className="product-stat">
            <span>Predicted</span>
            <strong>
              {product.predictedSales}
            </strong>
          </div>

          <div className="product-stat">
            <span>Actual</span>
            <strong>
              {product.actualSales}
            </strong>
          </div>

          <div className="product-stat">
            <span>Remaining</span>
            <strong>
              {remainingStock}
            </strong>
          </div>

        </div>

        {/* Sales Warning */}

        {lowSales && (
          <div className="sales-warning">

            <Package size={14} />

            <span>
              {salesDifference} units below
              predicted sales
            </span>

          </div>
        )}

        {/* Expiry */}

        <div className="expiry-container">

          <div className="expiry-label">
            <span>Expires in</span>
          </div>

          <ExpiryTimer
            expiryDate={
              product.expiryDate
            }
          />

        </div>

      </div>

    </div>
  );
};

export default ProductCard;