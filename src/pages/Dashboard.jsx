import React from "react";

import {
  Package,
  AlertTriangle,
  Tag,
  ArrowLeftRight,
  TrendingUp,
  Clock3,
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";

import products from "../data/products.json";

import "../styles/pages/dashboard.css";

const Dashboard = () => {

  /* =========================
     BASIC CALCULATIONS
  ========================= */

  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (total, product) =>
        total + product.stock,
      0
    );

  const totalActualSales =
    products.reduce(
      (total, product) =>
        total + product.actualSales,
      0
    );

  const totalPredictedSales =
    products.reduce(
      (total, product) =>
        total + product.predictedSales,
      0
    );


  /* =========================
     SALES PERFORMANCE
  ========================= */

  const salesAchievement =
    totalPredictedSales > 0
      ? Math.round(
          (totalActualSales /
            totalPredictedSales) *
            100
        )
      : 0;


  /* =========================
     NEAR EXPIRY PRODUCTS
  ========================= */

  const now = new Date();

  const nearExpiryProducts =
    products.filter((product) => {

      const expiry =
        new Date(product.expiryDate);

      const difference =
        expiry.getTime() -
        now.getTime();

      const hoursRemaining =
        difference /
        (1000 * 60 * 60);

      return (
        hoursRemaining > 0 &&
        hoursRemaining <= 48
      );
    });


  /* =========================
     LOW STOCK
  ========================= */

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <= 20
    );


  /* =========================
     DISCOUNT CANDIDATES
  ========================= */

  const discountCandidates =
    products.filter(
      (product) =>
        product.actualSales <
        product.predictedSales &&
        product.stock -
          product.actualSales >
          0
    );


  /* =========================
     STORE SUMMARY
  ========================= */

  const storeNames = [
    "Pimpri Store",
    "Alandi Store",
    "Pune Store",
  ];

  const storeSummary =
    storeNames.map(
      (store) => {

        const storeProducts =
          products.filter(
            (product) =>
              product.store ===
              store
          );

        const stock =
          storeProducts.reduce(
            (total, product) =>
              total + product.stock,
            0
          );

        const sales =
          storeProducts.reduce(
            (total, product) =>
              total + product.actualSales,
            0
          );

        const predicted =
          storeProducts.reduce(
            (total, product) =>
              total +
              product.predictedSales,
            0
          );

        const achievement =
          predicted > 0
            ? Math.round(
                (sales / predicted) *
                  100
              )
            : 0;

        return {
          store,
          stock,
          sales,
          predicted,
          achievement,
        };
      }
    );


  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Quick overview of inventory,
            sales and near-expiry products.
          </p>

        </div>

        <div className="dashboard-date">

          <Clock3 size={14} />

          <span>
            Live Inventory
          </span>

        </div>

      </div>


      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="dashboard-summary">

        {/* PRODUCTS */}

        <div className="dashboard-card">

          <div className="dashboard-card-icon blue">
            <Package size={20} />
          </div>

          <div>

            <span>
              Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              Active products
            </small>

          </div>

        </div>


        {/* STOCK */}

        <div className="dashboard-card">

          <div className="dashboard-card-icon green">
            <Package size={20} />
          </div>

          <div>

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

            <small>
              Units available
            </small>

          </div>

        </div>


        {/* NEAR EXPIRY */}

        <div className="dashboard-card">

          <div className="dashboard-card-icon red">
            <AlertTriangle size={20} />
          </div>

          <div>

            <span>
              Near Expiry
            </span>

            <strong>
              {nearExpiryProducts.length}
            </strong>

            <small>
              Within 48 hours
            </small>

          </div>

        </div>


        {/* DISCOUNT */}

        <div className="dashboard-card">

          <div className="dashboard-card-icon orange">
            <Tag size={20} />
          </div>

          <div>

            <span>
              Discount Candidates
            </span>

            <strong>
              {discountCandidates.length}
            </strong>

            <small>
              Need manager review
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          MAIN GRID
      ========================= */}

      <div className="dashboard-main-grid">

        {/* =========================
            SALES PERFORMANCE
        ========================= */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Sales Performance
              </h2>

              <span>
                Actual vs predicted sales
              </span>

            </div>

            <TrendingUp
              size={18}
            />

          </div>


          <div className="sales-performance">

            <div className="sales-performance-number">

              <strong>
                {salesAchievement}%
              </strong>

              <span>
                Prediction Achievement
              </span>

            </div>


            <div className="sales-progress">

              <div
                className="sales-progress-fill"
                style={{
                  width: `${Math.min(
                    salesAchievement,
                    100
                  )}%`,
                }}
              />

            </div>


            <div className="sales-performance-details">

              <div>

                <span>
                  Actual Sales
                </span>

                <strong>
                  {totalActualSales}
                </strong>

              </div>


              <div>

                <span>
                  Predicted Sales
                </span>

                <strong>
                  {totalPredictedSales}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            ALERTS
        ========================= */}

        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Attention Required
              </h2>

              <span>
                Products needing review
              </span>

            </div>

            <AlertTriangle
              size={18}
            />

          </div>


          <div className="dashboard-alert-list">

            <div className="dashboard-alert">

              <div className="alert-icon red">
                <AlertTriangle size={15} />
              </div>

              <div>

                <strong>
                  Near Expiry
                </strong>

                <span>
                  {nearExpiryProducts.length}
                  {" "}
                  products within 48 hours
                </span>

              </div>

            </div>


            <div className="dashboard-alert">

              <div className="alert-icon orange">
                <Tag size={15} />
              </div>

              <div>

                <strong>
                  Discount Review
                </strong>

                <span>
                  {discountCandidates.length}
                  {" "}
                  products below prediction
                </span>

              </div>

            </div>


            <div className="dashboard-alert">

              <div className="alert-icon blue">
                <Package size={15} />
              </div>

              <div>

                <strong>
                  Low Stock
                </strong>

                <span>
                  {lowStockProducts.length}
                  {" "}
                  products need attention
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          STORE PERFORMANCE
      ========================= */}

      <div className="dashboard-panel store-performance-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Store Performance
            </h2>

            <span>
              Store-wise inventory and sales
            </span>

          </div>

          <ArrowLeftRight
            size={18}
          />

        </div>


        <div className="store-performance-grid">

          {storeSummary.map(
            (store) => (

              <div
                className="store-performance-card"
                key={store.store}
              >

                <div className="store-performance-top">

                  <div>

                    <strong>
                      {store.store}
                    </strong>

                    <span>
                      Inventory
                    </span>

                  </div>

                  <strong>
                    {store.stock}
                  </strong>

                </div>


                <div className="store-performance-row">

                  <span>
                    Actual Sales
                  </span>

                  <strong>
                    {store.sales}
                  </strong>

                </div>


                <div className="store-performance-row">

                  <span>
                    Predicted
                  </span>

                  <strong>
                    {store.predicted}
                  </strong>

                </div>


                <div className="store-performance-row">

                  <span>
                    Achievement
                  </span>

                  <strong className="achievement-value">
                    {store.achievement}%
                  </strong>

                </div>


                <div className="store-mini-progress">

                  <div
                    style={{
                      width: `${Math.min(
                        store.achievement,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* =========================
          NEAR EXPIRY PREVIEW
      ========================= */}

      <div className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Near Expiry Products
            </h2>

            <span>
              Products requiring immediate attention
            </span>

          </div>

          <AlertTriangle
            size={18}
          />

        </div>


        <div className="dashboard-product-list">

          {nearExpiryProducts
            .slice(0, 4)
            .map(
              (product) => (

                <div
                  className="dashboard-product"
                  key={product.id}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />


                  <div className="dashboard-product-info">

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.store}
                    </span>

                  </div>


                  <div className="dashboard-product-stock">

                    <span>
                      Remaining
                    </span>

                    <strong>
                      {Math.max(
                        product.stock -
                          product.actualSales,
                        0
                      )}
                    </strong>

                  </div>


                  <div className="dashboard-product-warning">

                    <AlertTriangle
                      size={14}
                    />

                    <span>
                      Review
                    </span>

                  </div>

                </div>

              )
            )}

        </div>


        {nearExpiryProducts.length === 0 && (

          <div className="dashboard-empty">

            <CheckCircle2
              size={25}
            />

            <span>
              No products are currently
              near expiry.
            </span>

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;