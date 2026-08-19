import React, { useState } from "react";

import {
  Tag,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  Package,
} from "lucide-react";

import products from "../data/products.json";

import StoreSelector from "../components/StoreSelector";
import Modal from "../components/Modal";

import { getSettings } from "../services/settingsService";

import "../styles/pages/discounts.css";


const Discounts = () => {

  /* =========================
     SETTINGS
  ========================= */

  const settings = getSettings();

  const discountEnabled =
    settings.discountEnabled;

  const discountThreshold =
    settings.discountThreshold;


  /* =========================
     STATE
  ========================= */

  const [selectedStore, setSelectedStore] =
    useState("All Stores");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [managerDecisions, setManagerDecisions] =
    useState({});


  /* =========================
     STORES
  ========================= */

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


  /*
    =========================
    RESEARCH RULE
    =========================

    Discount recommendation is generated
    only when:

    Actual Sales < Predicted Sales

    AND

    Remaining Stock > 0

    AND

    Discount recommendations are enabled
    from Settings.
  */


  const discountCandidates =
    discountEnabled
      ? products.filter((product) => {

          const remainingStock =
            Math.max(
              product.stock -
                product.actualSales,
              0
            );


          const salesBelowPrediction =
            product.actualSales <
            product.predictedSales;


          const hasRemainingStock =
            remainingStock > 0;


          const matchesStore =
            selectedStore ===
              "All Stores" ||
            product.store ===
              selectedStore;


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
            salesBelowPrediction &&
            hasRemainingStock &&
            matchesStore &&
            matchesSearch
          );

        })
      : [];


  /*
    =========================
    DISCOUNT LEVEL
    =========================
  */

  const getDiscountRecommendation = (
    product
  ) => {

    const salesGap =
      product.predictedSales -
      product.actualSales;


    const percentageGap =
      product.predictedSales > 0
        ? (
            salesGap /
            product.predictedSales
          ) *
          100
        : 0;


    /*
      High gap
      Base recommendation = 30%
    */

    if (percentageGap >= 50) {

      return {
        discount: Math.max(
          30,
          discountThreshold
        ),
        level: "High",
        className: "high",
      };

    }


    /*
      Medium gap
      Base recommendation = 20%
    */

    if (percentageGap >= 30) {

      return {
        discount: Math.max(
          20,
          discountThreshold
        ),
        level: "Medium",
        className: "medium",
      };

    }


    /*
      Low gap
      Base recommendation = 10%
    */

    return {
      discount: Math.max(
        10,
        discountThreshold
      ),
      level: "Low",
      className: "low",
    };

  };


  /*
    =========================
    SUMMARY
    =========================
  */

  const totalCandidates =
    discountCandidates.length;


  const totalRemainingUnits =
    discountCandidates.reduce(
      (total, product) => {

        return (
          total +
          Math.max(
            product.stock -
              product.actualSales,
            0
          )
        );

      },
      0
    );


  const approvedCount =
    Object.values(
      managerDecisions
    ).filter(
      (decision) =>
        decision === "approved"
    ).length;


  const rejectedCount =
    Object.values(
      managerDecisions
    ).filter(
      (decision) =>
        decision === "rejected"
    ).length;


  /*
    =========================
    OPEN MODAL
    =========================
  */

  const handleReview = (
    product
  ) => {

    setSelectedProduct(
      product
    );

    setIsModalOpen(true);

  };


  /*
    =========================
    CLOSE MODAL
    =========================
  */

  const handleCloseModal = () => {

    setIsModalOpen(false);

    setSelectedProduct(null);

  };


  /*
    =========================
    MANAGER DECISION
    =========================
  */

  const handleDecision = (
    productId,
    decision
  ) => {

    setManagerDecisions(
      (previous) => ({
        ...previous,
        [productId]: decision,
      })
    );

    setIsModalOpen(false);

    setSelectedProduct(null);

  };


  return (
    <div className="discounts-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="discounts-header">

        <div className="discounts-title">

          <div className="discounts-title-icon">

            <Tag size={21} />

          </div>

          <div>

            <h1>
              Discount Management
            </h1>

            <p>
              Review products with lower-than-
              predicted daily sales.
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
          DISCOUNT DISABLED MESSAGE
      ========================= */}

      {!discountEnabled && (

        <div className="discount-rule">

          <div className="discount-rule-icon">

            <AlertTriangle
              size={18}
            />

          </div>

          <div>

            <strong>
              Discount Recommendations Disabled
            </strong>

            <p>
              Discount recommendations are
              currently disabled in Settings.
              The manager can enable them from
              the Settings page.
            </p>

          </div>

        </div>

      )}


      {/* =========================
          RESEARCH RULE
      ========================= */}

      {discountEnabled && (

        <div className="discount-rule">

          <div className="discount-rule-icon">

            <AlertTriangle
              size={18}
            />

          </div>

          <div>

            <strong>
              Discount Decision Rule
            </strong>

            <p>
              A discount is only recommended
              when actual daily sales are lower
              than predicted sales and unsold
              stock remains. The final discount
              decision is controlled by the manager.
            </p>

          </div>

        </div>

      )}


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="discount-summary">

        <div className="discount-summary-card">

          <div className="discount-summary-icon orange">

            <Tag size={19} />

          </div>

          <div>

            <span>
              Candidates
            </span>

            <strong>
              {totalCandidates}
            </strong>

            <small>
              Products requiring review
            </small>

          </div>

        </div>


        <div className="discount-summary-card">

          <div className="discount-summary-icon red">

            <PackageIcon />

          </div>

          <div>

            <span>
              Remaining Units
            </span>

            <strong>
              {totalRemainingUnits}
            </strong>

            <small>
              Unsold stock
            </small>

          </div>

        </div>


        <div className="discount-summary-card">

          <div className="discount-summary-icon green">

            <CheckCircle2 size={19} />

          </div>

          <div>

            <span>
              Approved
            </span>

            <strong>
              {approvedCount}
            </strong>

            <small>
              Manager approved
            </small>

          </div>

        </div>


        <div className="discount-summary-card">

          <div className="discount-summary-icon gray">

            <XCircle size={19} />

          </div>

          <div>

            <span>
              Rejected
            </span>

            <strong>
              {rejectedCount}
            </strong>

            <small>
              Manager rejected
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="discount-toolbar">

        <div>

          <h2>
            Discount Recommendations
          </h2>

          <span>
            {discountEnabled
              ? `Minimum configured discount: ${discountThreshold}%`
              : "Recommendations disabled"}
          </span>

        </div>


        <div className="discount-search">

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
          PRODUCT LIST
      ========================= */}

      <div className="discount-list">

        {discountCandidates.map(
          (product) => {

            const remainingStock =
              Math.max(
                product.stock -
                  product.actualSales,
                0
              );


            const salesGap =
              Math.max(
                product.predictedSales -
                  product.actualSales,
                0
              );


            const recommendation =
              getDiscountRecommendation(
                product
              );


            const decision =
              managerDecisions[
                product.id
              ];


            return (

              <div
                className="discount-card"
                key={product.id}
              >

                {/* IMAGE */}

                <div className="discount-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <span
                    className={`discount-level ${recommendation.className}`}
                  >
                    {recommendation.level}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="discount-content">

                  <div className="discount-product-header">

                    <div>

                      <h3>
                        {product.name}
                      </h3>

                      <span>
                        {product.category}
                        {" • "}
                        {product.store}
                      </span>

                    </div>


                    <div className="recommended-discount">

                      <small>
                        Recommended
                      </small>

                      <strong>
                        {recommendation.discount}%
                      </strong>

                      <span>
                        discount
                      </span>

                    </div>

                  </div>


                  {/* SALES COMPARISON */}

                  <div className="discount-sales">

                    <div>

                      <span>
                        Predicted Sales
                      </span>

                      <strong>
                        {product.predictedSales}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Actual Sales
                      </span>

                      <strong>
                        {product.actualSales}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Sales Gap
                      </span>

                      <strong className="sales-gap">
                        {salesGap}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Remaining
                      </span>

                      <strong className="remaining-units">
                        {remainingStock}
                      </strong>

                    </div>

                  </div>


                  {/* EXPLANATION */}

                  <div className="discount-reason">

                    <AlertTriangle
                      size={14}
                    />

                    <span>

                      Actual sales are below
                      predicted sales by{" "}

                      <strong>
                        {salesGap}
                      </strong>{" "}

                      units. Remaining stock:

                      {" "}

                      <strong>
                        {remainingStock}
                      </strong>{" "}

                      units.

                    </span>

                  </div>


                  {/* DECISION STATUS */}

                  {decision && (

                    <div
                      className={
                        decision ===
                        "approved"
                          ? "decision-status approved"
                          : "decision-status rejected"
                      }
                    >

                      {decision ===
                      "approved" ? (

                        <>
                          <CheckCircle2
                            size={14}
                          />

                          <span>
                            Discount Approved
                          </span>
                        </>

                      ) : (

                        <>
                          <XCircle
                            size={14}
                          />

                          <span>
                            Discount Rejected
                          </span>
                        </>

                      )}

                    </div>

                  )}


                  {/* ACTION */}

                  {!decision && (

                    <button
                      type="button"
                      className="review-discount-button"
                      onClick={() =>
                        handleReview(
                          product
                        )
                      }
                    >
                      Review Discount
                    </button>

                  )}

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* =========================
          EMPTY
      ========================= */}

      {discountCandidates.length === 0 && (

        <div className="discount-empty">

          {discountEnabled ? (

            <>

              <CheckCircle2
                size={30}
              />

              <strong>
                No discount recommendations
              </strong>

              <span>
                All filtered products are
                currently performing at or
                above their predicted sales
                level.
              </span>

            </>

          ) : (

            <>

              <Tag
                size={30}
              />

              <strong>
                Discount recommendations are disabled
              </strong>

              <span>
                Enable discount recommendations
                from Settings to generate
                candidates.
              </span>

            </>

          )}

        </div>

      )}


      {/* =========================
          MANAGER MODAL
      ========================= */}

      <Modal
        isOpen={isModalOpen}
        title="Manager Discount Review"
        onClose={
          handleCloseModal
        }
      >

        {selectedProduct && (

          <div className="discount-modal">

            {/* PRODUCT */}

            <div className="modal-discount-product">

              <img
                src={
                  selectedProduct.image
                }
                alt={
                  selectedProduct.name
                }
              />

              <div>

                <h3>
                  {
                    selectedProduct.name
                  }
                </h3>

                <span>
                  {
                    selectedProduct.category
                  }

                  {" • "}

                  {
                    selectedProduct.store
                  }
                </span>

              </div>

            </div>


            {/* RULE RESULT */}

            <div className="modal-rule-result">

              <div>

                <span>
                  Predicted Sales
                </span>

                <strong>
                  {
                    selectedProduct.predictedSales
                  }
                </strong>

              </div>


              <div>

                <span>
                  Actual Sales
                </span>

                <strong>
                  {
                    selectedProduct.actualSales
                  }
                </strong>

              </div>


              <div>

                <span>
                  Remaining Stock
                </span>

                <strong>

                  {Math.max(
                    selectedProduct.stock -
                      selectedProduct.actualSales,
                    0
                  )}

                </strong>

              </div>

            </div>


            {/* RECOMMENDATION */}

            <div className="modal-discount-recommendation">

              <Tag size={17} />

              <div>

                <span>
                  System Recommendation
                </span>

                <strong>

                  {
                    getDiscountRecommendation(
                      selectedProduct
                    ).discount
                  }%

                  {" "}
                  Discount

                </strong>

                <small>
                  Manager can approve or
                  reject this recommendation.
                </small>

              </div>

            </div>


            {/* MANAGER DECISION */}

            <div className="discount-manager-decision">

              <p>
                Manager Decision
              </p>

              <div>

                <button
                  type="button"
                  className="approve-discount"
                  onClick={() =>
                    handleDecision(
                      selectedProduct.id,
                      "approved"
                    )
                  }
                >

                  <CheckCircle2
                    size={15}
                  />

                  Approve Discount

                </button>


                <button
                  type="button"
                  className="reject-discount"
                  onClick={() =>
                    handleDecision(
                      selectedProduct.id,
                      "rejected"
                    )
                  }
                >

                  <XCircle
                    size={15}
                  />

                  Reject

                </button>

              </div>

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
};


/*
  Small reusable icon component
  for the summary card.
*/

const PackageIcon = () => {

  return (
    <Package
      size={19}
    />
  );

};


export default Discounts;