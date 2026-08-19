import React from "react";

import {
  FileText,
  Package,
  ShoppingCart,
  AlertTriangle,
  Tag,
  ArrowLeftRight,
  TrendingUp,
  CheckCircle2,
  Target,
} from "lucide-react";

import products from "../data/products.json";

import "../styles/pages/reports.css";


const Reports = () => {

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
     SALES ACHIEVEMENT
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
     SALES GAP
  ========================= */

  const salesGap =
    totalPredictedSales -
    totalActualSales;


  /* =========================
     NEAR EXPIRY
  ========================= */

  const currentTime =
    new Date();

  const nearExpiryProducts =
    products.filter(
      (product) => {

        const expiryDate =
          new Date(
            product.expiryDate
          );

        const difference =
          expiryDate.getTime() -
          currentTime.getTime();

        const hoursRemaining =
          difference /
          (1000 * 60 * 60);

        return (
          hoursRemaining > 0 &&
          hoursRemaining <= 48
        );

      }
    );


  /* =========================
     DISCOUNT CANDIDATES
  ========================= */

  const discountCandidates =
    products.filter(
      (product) => {

        const remainingStock =
          Math.max(
            product.stock -
              product.actualSales,
            0
          );

        return (
          product.actualSales <
            product.predictedSales &&
          remainingStock > 0
        );

      }
    );


  /* =========================
     REMAINING STOCK
  ========================= */

  const totalRemainingStock =
    products.reduce(
      (total, product) => {

        const remaining =
          Math.max(
            product.stock -
              product.actualSales,
            0
          );

        return total + remaining;

      },
      0
    );


  /* =========================
     ABOVE / BELOW PREDICTION
  ========================= */

  const abovePrediction =
    products.filter(
      (product) =>
        product.actualSales >
        product.predictedSales
    ).length;


  const belowPrediction =
    products.filter(
      (product) =>
        product.actualSales <
        product.predictedSales
    ).length;


  const onTarget =
    products.filter(
      (product) =>
        product.actualSales ===
        product.predictedSales
    ).length;


  /* =========================
     STORE REPORT
  ========================= */

  const storeNames = [
    "Pimpri Store",
    "Alandi Store",
    "Pune Store",
  ];


  const storeReports =
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


        const actualSales =
          storeProducts.reduce(
            (total, product) =>
              total +
              product.actualSales,
            0
          );


        const predictedSales =
          storeProducts.reduce(
            (total, product) =>
              total +
              product.predictedSales,
            0
          );


        const achievement =
          predictedSales > 0
            ? Math.round(
                (actualSales /
                  predictedSales) *
                  100
              )
            : 0;


        return {
          store,
          stock,
          actualSales,
          predictedSales,
          achievement,
        };

      }
    );


  return (
    <div className="reports-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="reports-header">

        <div className="reports-title">

          <div className="reports-title-icon">

            <FileText
              size={21}
            />

          </div>

          <div>

            <h1>
              Reports
            </h1>

            <p>
              Overall inventory, sales,
              expiry and decision-support report.
            </p>

          </div>

        </div>


        <div className="report-date">

          <FileText
            size={14}
          />

          <span>
            Current Report
          </span>

        </div>

      </div>


      {/* =========================
          INVENTORY SUMMARY
      ========================= */}

      <div className="report-summary">

        <div className="report-summary-card">

          <div className="report-summary-icon blue">

            <Package
              size={20}
            />

          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              Products in inventory
            </small>

          </div>

        </div>


        <div className="report-summary-card">

          <div className="report-summary-icon green">

            <Package
              size={20}
            />

          </div>

          <div>

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

            <small>
              Inventory units
            </small>

          </div>

        </div>


        <div className="report-summary-card">

          <div className="report-summary-icon orange">

            <ShoppingCart
              size={20}
            />

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


        <div className="report-summary-card">

          <div className="report-summary-icon purple">

            <TrendingUp
              size={20}
            />

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

      </div>


      {/* =========================
          RESEARCH METRICS
      ========================= */}

      <div className="report-grid">

        {/* SALES PERFORMANCE */}

        <div className="report-panel">

          <div className="report-panel-header">

            <div>

              <h2>
                Sales Performance
              </h2>

              <span>
                Actual sales compared with
                predicted demand
              </span>

            </div>

            <TrendingUp
              size={18}
            />

          </div>


          <div className="report-large-number">

            <strong>
              {salesAchievement}%
            </strong>

            <span>
              Prediction Achievement
            </span>

          </div>


          <div className="report-progress">

            <div
              style={{
                width: `${Math.min(
                  salesAchievement,
                  100
                )}%`,
              }}
            />

          </div>


          <div className="report-two-column">

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


          <div className="report-gap">

            <span>
              Sales Gap
            </span>

            <strong>
              {salesGap > 0
                ? `-${salesGap}`
                : `+${Math.abs(
                    salesGap
                  )}`}
            </strong>

          </div>

        </div>


        {/* INVENTORY RISK */}

        <div className="report-panel">

          <div className="report-panel-header">

            <div>

              <h2>
                Inventory Risk
              </h2>

              <span>
                Products requiring attention
              </span>

            </div>

            <AlertTriangle
              size={18}
            />

          </div>


          <div className="risk-list">

            <div className="risk-item">

              <div className="risk-icon red">

                <AlertTriangle
                  size={15}
                />

              </div>

              <div>

                <span>
                  Near Expiry
                </span>

                <strong>
                  {
                    nearExpiryProducts.length
                  }
                </strong>

              </div>

            </div>


            <div className="risk-item">

              <div className="risk-icon orange">

                <Tag
                  size={15}
                />

              </div>

              <div>

                <span>
                  Discount Candidates
                </span>

                <strong>
                  {
                    discountCandidates.length
                  }
                </strong>

              </div>

            </div>


            <div className="risk-item">

              <div className="risk-icon blue">

                <Package
                  size={15}
                />

              </div>

              <div>

                <span>
                  Remaining Stock
                </span>

                <strong>
                  {totalRemainingStock}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          PREDICTION STATUS
      ========================= */}

      <div className="report-panel">

        <div className="report-panel-header">

          <div>

            <h2>
              Prediction Status
            </h2>

            <span>
              Product performance against
              predicted sales
            </span>

          </div>

          <TargetIcon />

        </div>


        <div className="prediction-status-grid">

          <div className="prediction-report-card green">

            <CheckCircle2
              size={18}
            />

            <span>
              Above Prediction
            </span>

            <strong>
              {abovePrediction}
            </strong>

          </div>


          <div className="prediction-report-card red">

            <AlertTriangle
              size={18}
            />

            <span>
              Below Prediction
            </span>

            <strong>
              {belowPrediction}
            </strong>

          </div>


          <div className="prediction-report-card blue">

            <TargetIcon />

            <span>
              On Target
            </span>

            <strong>
              {onTarget}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          STORE PERFORMANCE
      ========================= */}

      <div className="report-panel">

        <div className="report-panel-header">

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


        <div className="store-report-grid">

          {storeReports.map(
            (store) => (

              <div
                className="store-report-card"
                key={store.store}
              >

                <div className="store-report-header">

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


                <div className="store-report-row">

                  <span>
                    Actual Sales
                  </span>

                  <strong>
                    {store.actualSales}
                  </strong>

                </div>


                <div className="store-report-row">

                  <span>
                    Predicted Sales
                  </span>

                  <strong>
                    {store.predictedSales}
                  </strong>

                </div>


                <div className="store-report-row">

                  <span>
                    Achievement
                  </span>

                  <strong>
                    {store.achievement}%
                  </strong>

                </div>


                <div className="store-report-progress">

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
          DECISION SUPPORT SUMMARY
      ========================= */}

      <div className="report-panel">

        <div className="report-panel-header">

          <div>

            <h2>
              Decision Support Summary
            </h2>

            <span>
              Current recommendations requiring
              manager attention
            </span>

          </div>

          <ArrowLeftRight
            size={18}
          />

        </div>


        <div className="decision-summary-grid">

          <div>

            <div className="decision-summary-icon orange">

              <Tag
                size={17}
              />

            </div>

            <span>
              Discount Review
            </span>

            <strong>
              {
                discountCandidates.length
              }
            </strong>

            <small>
              Products below predicted sales
            </small>

          </div>


          <div>

            <div className="decision-summary-icon red">

              <AlertTriangle
                size={17}
              />

            </div>

            <span>
              Near Expiry
            </span>

            <strong>
              {
                nearExpiryProducts.length
              }
            </strong>

            <small>
              Products within 48 hours
            </small>

          </div>


          <div>

            <div className="decision-summary-icon blue">

              <ArrowLeftRight
                size={17}
              />

            </div>

            <span>
              Transfer Review
            </span>

            <strong>
              Decision Support
            </strong>

            <small>
              Review surplus and demand
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          FOOTER NOTE
      ========================= */}

      <div className="report-note">

        <FileText
          size={16}
        />

        <div>

          <strong>
            Research System Report
          </strong>

          <span>
            This report summarizes inventory,
            sales prediction comparison,
            near-expiry products and
            manager decision-support information.
          </span>

        </div>

      </div>

    </div>
  );
};


/* =========================
   SMALL ICON COMPONENT
========================= */

const TargetIcon = () => {
  return (
    <Target
      size={18}
    />
  );
};


export default Reports;