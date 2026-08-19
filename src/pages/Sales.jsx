import React, { useState } from "react";

import {
  TrendingUp,
  ShoppingCart,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react";

import products from "../data/products.json";
import StoreSelector from "../components/StoreSelector";

import "../styles/pages/sales.css";

const Sales = () => {
  const [selectedStore, setSelectedStore] =
    useState("All Stores");

  const [searchTerm, setSearchTerm] =
    useState("");

  const stores = [
    {
      id: 1,
      name: "Pimpri Store",
    },
    {
      id: 2,
      name: "Alandi Store",
    },
    {
      id: 3,
      name: "Pune Store",
    },
  ];

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts =
    products.filter((product) => {

      const matchesStore =
        selectedStore === "All Stores" ||
        product.store === selectedStore;

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        product.category
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      return (
        matchesStore &&
        matchesSearch
      );
    });


  /* =========================
     TOTAL SALES
  ========================= */

  const totalActualSales =
    filteredProducts.reduce(
      (total, product) =>
        total + product.actualSales,
      0
    );

  const totalPredictedSales =
    filteredProducts.reduce(
      (total, product) =>
        total + product.predictedSales,
      0
    );


  /* =========================
     SALES GAP
  ========================= */

  const totalSalesGap =
    totalPredictedSales -
    totalActualSales;


  /* =========================
     ACHIEVEMENT
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
     ABOVE / BELOW PREDICTION
  ========================= */

  const abovePrediction =
    filteredProducts.filter(
      (product) =>
        product.actualSales >=
        product.predictedSales
    ).length;

  const belowPrediction =
    filteredProducts.filter(
      (product) =>
        product.actualSales <
        product.predictedSales
    ).length;


  /* =========================
     SALES STATUS
  ========================= */

  const getSalesStatus =
    (actual, predicted) => {

      if (actual > predicted) {
        return {
          label: "Above Prediction",
          className: "above",
        };
      }

      if (actual < predicted) {
        return {
          label: "Below Prediction",
          className: "below",
        };
      }

      return {
        label: "On Target",
        className: "target",
      };
    };


  return (
    <div className="sales-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="sales-header">

        <div className="sales-title">

          <div className="sales-title-icon">
            <TrendingUp size={21} />
          </div>

          <div>

            <h1>
              Sales
            </h1>

            <p>
              Compare actual product sales
              with predicted daily demand.
            </p>

          </div>

        </div>


        <StoreSelector
          stores={stores}
          selectedStore={
            selectedStore
          }
          setSelectedStore={
            setSelectedStore
          }
        />

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="sales-summary">

        {/* ACTUAL */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon blue">
            <ShoppingCart size={19} />
          </div>

          <div>

            <span>
              Actual Sales
            </span>

            <strong>
              {totalActualSales}
            </strong>

            <small>
              Units sold
            </small>

          </div>

        </div>


        {/* PREDICTED */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon purple">
            <Target size={19} />
          </div>

          <div>

            <span>
              Predicted Sales
            </span>

            <strong>
              {totalPredictedSales}
            </strong>

            <small>
              Expected units
            </small>

          </div>

        </div>


        {/* GAP */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon orange">
            <TrendingUp size={19} />
          </div>

          <div>

            <span>
              Sales Gap
            </span>

            <strong
              className={
                totalSalesGap > 0
                  ? "negative-gap"
                  : "positive-gap"
              }
            >
              {totalSalesGap > 0
                ? `-${totalSalesGap}`
                : `+${Math.abs(
                    totalSalesGap
                  )}`}
            </strong>

            <small>
              Predicted vs actual
            </small>

          </div>

        </div>


        {/* ACHIEVEMENT */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon green">
            <Target size={19} />
          </div>

          <div>

            <span>
              Achievement
            </span>

            <strong>
              {salesAchievement}%
            </strong>

            <small>
              Prediction achievement
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          PERFORMANCE
      ========================= */}

      <div className="sales-performance-panel">

        <div className="sales-performance-header">

          <div>

            <h2>
              Sales Performance
            </h2>

            <span>
              Overall actual sales compared
              with predicted demand
            </span>

          </div>

          <strong>
            {salesAchievement}%
          </strong>

        </div>


        <div className="sales-performance-bar">

          <div
            className="sales-performance-fill"
            style={{
              width: `${Math.min(
                salesAchievement,
                100
              )}%`,
            }}
          />

        </div>


        <div className="sales-performance-footer">

          <span>
            Actual:{" "}
            <strong>
              {totalActualSales}
            </strong>
          </span>

          <span>
            Predicted:{" "}
            <strong>
              {totalPredictedSales}
            </strong>
          </span>

        </div>

      </div>


      {/* =========================
          STATUS SUMMARY
      ========================= */}

      <div className="sales-status-row">

        <div className="sales-status-card">

          <div className="sales-status-icon green">

            <ArrowUpRight size={17} />

          </div>

          <div>

            <span>
              Above Prediction
            </span>

            <strong>
              {abovePrediction}
            </strong>

            <small>
              Products performing well
            </small>

          </div>

        </div>


        <div className="sales-status-card">

          <div className="sales-status-icon red">

            <ArrowDownRight size={17} />

          </div>

          <div>

            <span>
              Below Prediction
            </span>

            <strong>
              {belowPrediction}
            </strong>

            <small>
              Products requiring review
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="sales-toolbar">

        <div>

          <h2>
            Product Sales
          </h2>

          <span>
            {filteredProducts.length}
            {" "}
            products displayed
          </span>

        </div>


        <div className="sales-search">

          <Search size={15} />

          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div className="sales-table-container">

        <table className="sales-table">

          <thead>

            <tr>

              <th>
                Product
              </th>

              <th>
                Store
              </th>

              <th>
                Predicted
              </th>

              <th>
                Actual
              </th>

              <th>
                Gap
              </th>

              <th>
                Achievement
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredProducts.map(
              (product) => {

                const status =
                  getSalesStatus(
                    product.actualSales,
                    product.predictedSales
                  );

                const gap =
                  product.actualSales -
                  product.predictedSales;

                const achievement =
                  product.predictedSales > 0
                    ? Math.round(
                        (product.actualSales /
                          product.predictedSales) *
                          100
                      )
                    : 0;


                return (

                  <tr
                    key={product.id}
                  >

                    {/* PRODUCT */}

                    <td>

                      <div className="sales-product">

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                        />

                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.category}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* STORE */}

                    <td>
                      {product.store}
                    </td>


                    {/* PREDICTED */}

                    <td>

                      <strong>
                        {
                          product.predictedSales
                        }
                      </strong>

                    </td>


                    {/* ACTUAL */}

                    <td>

                      <strong>
                        {
                          product.actualSales
                        }
                      </strong>

                    </td>


                    {/* GAP */}

                    <td>

                      <span
                        className={
                          gap < 0
                            ? "sales-gap negative"
                            : "sales-gap positive"
                        }
                      >

                        {gap > 0
                          ? `+${gap}`
                          : gap}

                      </span>

                    </td>


                    {/* ACHIEVEMENT */}

                    <td>

                      <div className="achievement-cell">

                        <span>
                          {achievement}%
                        </span>

                        <div className="achievement-bar">

                          <div
                            style={{
                              width: `${Math.min(
                                achievement,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`sales-status ${status.className}`}
                      >
                        {status.label}
                      </span>

                    </td>

                  </tr>

                );
              }
            )}

          </tbody>

        </table>


        {filteredProducts.length === 0 && (

          <div className="sales-empty">

            <ShoppingCart
              size={30}
            />

            <strong>
              No sales data found
            </strong>

            <span>
              Try changing the store or
              search term.
            </span>

          </div>

        )}

      </div>

    </div>
  );
};

export default Sales;