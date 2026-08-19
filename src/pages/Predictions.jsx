import React, { useState } from "react";

import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Search,
} from "lucide-react";

import products from "../data/products.json";
import StoreSelector from "../components/StoreSelector";

import "../styles/pages/predictions.css";

const Predictions = () => {
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
     TOTALS
  ========================= */

  const totalPredicted =
    filteredProducts.reduce(
      (total, product) =>
        total +
        product.predictedSales,
      0
    );

  const totalActual =
    filteredProducts.reduce(
      (total, product) =>
        total +
        product.actualSales,
      0
    );


  /* =========================
     PREDICTION GAP
  ========================= */

  const totalGap =
    totalPredicted -
    totalActual;


  /* =========================
     ACHIEVEMENT
  ========================= */

  const overallAchievement =
    totalPredicted > 0
      ? Math.round(
          (totalActual /
            totalPredicted) *
            100
        )
      : 0;


  /* =========================
     PRODUCT COUNTS
  ========================= */

  const abovePrediction =
    filteredProducts.filter(
      (product) =>
        product.actualSales >
        product.predictedSales
    ).length;


  const belowPrediction =
    filteredProducts.filter(
      (product) =>
        product.actualSales <
        product.predictedSales
    ).length;


  const onTarget =
    filteredProducts.filter(
      (product) =>
        product.actualSales ===
        product.predictedSales
    ).length;


  /* =========================
     STATUS
  ========================= */

  const getPredictionStatus = (
    actual,
    predicted
  ) => {

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


  /* =========================
     ACCURACY
  ========================= */

  const calculateAccuracy = (
    actual,
    predicted
  ) => {

    if (predicted === 0) {
      return 0;
    }

    const error =
      Math.abs(
        predicted - actual
      );

    const accuracy =
      100 -
      (error / predicted) * 100;

    return Math.max(
      Math.round(accuracy),
      0
    );
  };


  return (
    <div className="predictions-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="predictions-header">

        <div className="predictions-title">

          <div className="predictions-title-icon">
            <Brain size={21} />
          </div>

          <div>

            <h1>
              Predictions
            </h1>

            <p>
              Compare predicted demand with
              actual daily product sales.
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
          INFORMATION
      ========================= */}

      <div className="prediction-info">

        <div className="prediction-info-icon">

          <Brain size={18} />

        </div>

        <div>

          <strong>
            Prediction Analysis
          </strong>

          <p>
            The system compares predicted
            daily sales with actual sales.
            Products performing below their
            prediction are identified for
            further manager review.
          </p>

        </div>

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="prediction-summary">

        <div className="prediction-summary-card">

          <div className="prediction-summary-icon purple">
            <Target size={19} />
          </div>

          <div>

            <span>
              Predicted Sales
            </span>

            <strong>
              {totalPredicted}
            </strong>

            <small>
              Expected units
            </small>

          </div>

        </div>


        <div className="prediction-summary-card">

          <div className="prediction-summary-icon blue">
            <TrendingUp size={19} />
          </div>

          <div>

            <span>
              Actual Sales
            </span>

            <strong>
              {totalActual}
            </strong>

            <small>
              Sold units
            </small>

          </div>

        </div>


        <div className="prediction-summary-card">

          <div className="prediction-summary-icon orange">
            <TrendingDown size={19} />
          </div>

          <div>

            <span>
              Prediction Gap
            </span>

            <strong className="prediction-gap-value">
              {totalGap}
            </strong>

            <small>
              Units below prediction
            </small>

          </div>

        </div>


        <div className="prediction-summary-card">

          <div className="prediction-summary-icon green">
            <Target size={19} />
          </div>

          <div>

            <span>
              Achievement
            </span>

            <strong>
              {overallAchievement}%
            </strong>

            <small>
              Actual vs predicted
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          PERFORMANCE
      ========================= */}

      <div className="prediction-performance">

        <div className="prediction-performance-header">

          <div>

            <h2>
              Prediction Performance
            </h2>

            <span>
              Overall actual sales achievement
            </span>

          </div>

          <strong>
            {overallAchievement}%
          </strong>

        </div>


        <div className="prediction-progress">

          <div
            style={{
              width: `${Math.min(
                overallAchievement,
                100
              )}%`,
            }}
          />

        </div>


        <div className="prediction-performance-footer">

          <span>
            Predicted:
            {" "}
            <strong>
              {totalPredicted}
            </strong>
          </span>

          <span>
            Actual:
            {" "}
            <strong>
              {totalActual}
            </strong>
          </span>

        </div>

      </div>


      {/* =========================
          STATUS CARDS
      ========================= */}

      <div className="prediction-status-row">

        <div className="prediction-status-card">

          <div className="prediction-status-icon green">

            <TrendingUp size={17} />

          </div>

          <div>

            <span>
              Above Prediction
            </span>

            <strong>
              {abovePrediction}
            </strong>

            <small>
              Products performing better
            </small>

          </div>

        </div>


        <div className="prediction-status-card">

          <div className="prediction-status-icon red">

            <TrendingDown size={17} />

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


        <div className="prediction-status-card">

          <div className="prediction-status-icon blue">

            <Target size={17} />

          </div>

          <div>

            <span>
              On Target
            </span>

            <strong>
              {onTarget}
            </strong>

            <small>
              Matching prediction
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="prediction-toolbar">

        <div>

          <h2>
            Product Predictions
          </h2>

          <span>
            {filteredProducts.length}
            {" "}
            products displayed
          </span>

        </div>


        <div className="prediction-search">

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

      <div className="prediction-table-container">

        <table className="prediction-table">

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
                Accuracy
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
                  getPredictionStatus(
                    product.actualSales,
                    product.predictedSales
                  );

                const gap =
                  product.predictedSales -
                  product.actualSales;

                const accuracy =
                  calculateAccuracy(
                    product.actualSales,
                    product.predictedSales
                  );


                return (

                  <tr
                    key={product.id}
                  >

                    {/* PRODUCT */}

                    <td>

                      <div className="prediction-product">

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
                          gap > 0
                            ? "prediction-gap negative"
                            : gap < 0
                            ? "prediction-gap positive"
                            : "prediction-gap target"
                        }
                      >

                        {gap > 0
                          ? `-${gap}`
                          : gap < 0
                          ? `+${Math.abs(
                              gap
                            )}`
                          : "0"}

                      </span>

                    </td>


                    {/* ACCURACY */}

                    <td>

                      <div className="prediction-accuracy">

                        <span>
                          {accuracy}%
                        </span>

                        <div className="accuracy-bar">

                          <div
                            style={{
                              width: `${accuracy}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`prediction-status ${status.className}`}
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

          <div className="prediction-empty">

            <Brain size={30} />

            <strong>
              No prediction data found
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

export default Predictions;