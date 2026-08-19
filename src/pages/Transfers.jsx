import React, { useState } from "react";

import {
  ArrowLeftRight,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
} from "lucide-react";

import products from "../data/products.json";

import StoreSelector from "../components/StoreSelector";
import Modal from "../components/Modal";

import { getSettings } from "../services/settingsService";

import "../styles/pages/transfers.css";


const Transfers = () => {

  /* =========================
     SETTINGS
  ========================= */

  const settings = getSettings();

  const transferEnabled =
    settings.transferEnabled;


  /* =========================
     STATE
  ========================= */

  const [selectedStore, setSelectedStore] =
    useState("All Stores");

  const [selectedTransfer, setSelectedTransfer] =
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


  /* =========================
     STORE DEMAND
  ========================= */

  const storeDemand = stores.map(
    (store) => {

      const storeProducts =
        products.filter(
          (product) =>
            product.store ===
            store.name
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


      const stock =
        storeProducts.reduce(
          (total, product) =>
            total +
            product.stock,
          0
        );


      return {
        store: store.name,
        actualSales,
        predictedSales,
        stock,
        demandGap:
          predictedSales -
          actualSales,
      };

    }
  );


  /* =========================
     CREATE TRANSFER
     RECOMMENDATIONS
  ========================= */

  const transferRecommendations = [];


  if (transferEnabled) {

    products.forEach(
      (sourceProduct) => {

        const sourceRemainingStock =
          Math.max(
            sourceProduct.stock -
              sourceProduct.actualSales,
            0
          );


        /*
          Source product must have
          remaining stock.
        */

        if (
          sourceRemainingStock <= 0
        ) {
          return;
        }


        /*
          Source store has lower
          actual sales than predicted.
        */

        const sourceSalesGap =
          sourceProduct.predictedSales -
          sourceProduct.actualSales;


        if (
          sourceSalesGap <= 0
        ) {
          return;
        }


        /*
          Find same category products
          in other stores.
        */

        const destinationProducts =
          products.filter(
            (destinationProduct) =>
              destinationProduct.id !==
                sourceProduct.id &&
              destinationProduct.category ===
                sourceProduct.category &&
              destinationProduct.store !==
                sourceProduct.store &&
              destinationProduct.predictedSales >
                destinationProduct.actualSales
          );


        destinationProducts.forEach(
          (destinationProduct) => {

            const destinationDemandGap =
              destinationProduct.predictedSales -
              destinationProduct.actualSales;


            if (
              destinationDemandGap <= 0
            ) {
              return;
            }


            /*
              Suggested quantity.

              We do not transfer all stock.
              We transfer the smaller value
              between available surplus and
              destination demand gap.
            */

            const suggestedQuantity =
              Math.min(
                sourceRemainingStock,
                destinationDemandGap
              );


            if (
              suggestedQuantity <= 0
            ) {
              return;
            }


            transferRecommendations.push({

              id:
                `${sourceProduct.id}-${destinationProduct.id}`,

              product:
                sourceProduct.name,

              category:
                sourceProduct.category,

              image:
                sourceProduct.image,

              fromStore:
                sourceProduct.store,

              toStore:
                destinationProduct.store,

              availableStock:
                sourceRemainingStock,

              sourcePredictedDemand:
                sourceProduct.predictedSales,

              sourceActualSales:
                sourceProduct.actualSales,

              destinationPredictedDemand:
                destinationProduct.predictedSales,

              destinationActualSales:
                destinationProduct.actualSales,

              sourceDemandGap:
                sourceSalesGap,

              destinationDemandGap:
                destinationDemandGap,

              suggestedQuantity:
                suggestedQuantity,

              expiryDate:
                sourceProduct.expiryDate,

            });

          }
        );

      }
    );

  }


  /* =========================
     REMOVE DUPLICATES
  ========================= */

  const uniqueTransfers =
    transferRecommendations.filter(
      (
        transfer,
        index,
        array
      ) =>
        index ===
        array.findIndex(
          (item) =>
            item.product ===
              transfer.product &&
            item.fromStore ===
              transfer.fromStore &&
            item.toStore ===
              transfer.toStore
        )
    );


  /* =========================
     STORE FILTER
  ========================= */

  const filteredTransfers =
    uniqueTransfers.filter(
      (transfer) => {

        return (
          selectedStore ===
            "All Stores" ||
          transfer.fromStore ===
            selectedStore ||
          transfer.toStore ===
            selectedStore
        );

      }
    );


  /* =========================
     SUMMARY
  ========================= */

  const totalSuggestions =
    filteredTransfers.length;


  const totalSuggestedUnits =
    filteredTransfers.reduce(
      (total, transfer) =>
        total +
        transfer.suggestedQuantity,
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


  /* =========================
     PRIORITY
  ========================= */

  const getPriority = (
    transfer
  ) => {

    if (
      transfer.destinationDemandGap >=
      10
    ) {

      return {
        label: "Critical",
        className: "critical",
      };

    }


    if (
      transfer.destinationDemandGap >=
      5
    ) {

      return {
        label: "High",
        className: "high",
      };

    }


    return {
      label: "Medium",
      className: "medium",
    };

  };


  /* =========================
     REVIEW
  ========================= */

  const handleReview = (
    transfer
  ) => {

    setSelectedTransfer(
      transfer
    );

    setIsModalOpen(true);

  };


  /* =========================
     CLOSE MODAL
  ========================= */

  const handleCloseModal = () => {

    setIsModalOpen(false);

    setSelectedTransfer(null);

  };


  /* =========================
     MANAGER DECISION
  ========================= */

  const handleDecision = (
    transferId,
    decision
  ) => {

    setManagerDecisions(
      (previous) => ({
        ...previous,
        [transferId]:
          decision,
      })
    );

    setIsModalOpen(false);

    setSelectedTransfer(null);

  };


  return (
    <div className="transfers-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="transfers-header">

        <div className="transfers-title">

          <div className="transfers-title-icon">

            <ArrowLeftRight
              size={21}
            />

          </div>

          <div>

            <h1>
              Inter-Store Transfer
            </h1>

            <p>
              Identify surplus stock and
              transfer opportunities between stores.
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

      <div className="transfer-info">

        <div className="transfer-info-icon">

          <ArrowLeftRight
            size={18}
          />

        </div>

        <div>

          <strong>
            Transfer Decision Support
          </strong>

          <p>
            The system compares remaining
            stock and predicted demand across
            stores. A transfer is suggested when
            one store has available stock while
            another store shows higher unmet demand.
            The final decision remains with the manager.
          </p>

        </div>

      </div>


      {/* =========================
          TRANSFER DISABLED MESSAGE
      ========================= */}

      {!transferEnabled && (

        <div className="transfer-info">

          <div className="transfer-info-icon">

            <AlertTriangle
              size={18}
            />

          </div>

          <div>

            <strong>
              Transfer Recommendations Disabled
            </strong>

            <p>
              Inter-store transfer recommendations
              are currently disabled in Settings.
              The manager can enable them from
              the Settings page.
            </p>

          </div>

        </div>

      )}


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="transfer-summary">

        <div className="transfer-summary-card">

          <div className="transfer-summary-icon blue">

            <ArrowLeftRight
              size={20}
            />

          </div>

          <div>

            <span>
              Suggestions
            </span>

            <strong>
              {totalSuggestions}
            </strong>

            <small>
              Transfer opportunities
            </small>

          </div>

        </div>


        <div className="transfer-summary-card">

          <div className="transfer-summary-icon orange">

            <Package
              size={20}
            />

          </div>

          <div>

            <span>
              Suggested Units
            </span>

            <strong>
              {totalSuggestedUnits}
            </strong>

            <small>
              Units recommended
            </small>

          </div>

        </div>


        <div className="transfer-summary-card">

          <div className="transfer-summary-icon green">

            <CheckCircle2
              size={20}
            />

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


        <div className="transfer-summary-card">

          <div className="transfer-summary-icon red">

            <XCircle
              size={20}
            />

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
          RESULT HEADER
      ========================= */}

      <div className="transfer-result-header">

        <div>

          <h2>
            Transfer Recommendations
          </h2>

          <span>
            {transferEnabled
              ? "Based on current inventory and predicted demand"
              : "Recommendations disabled in Settings"}
          </span>

        </div>

        <span className="transfer-status">

          <span></span>

          {transferEnabled
            ? "Analysis Active"
            : "Analysis Disabled"}

        </span>

      </div>


      {/* =========================
          TRANSFER LIST
      ========================= */}

      <div className="transfer-list">

        {filteredTransfers.map(
          (transfer) => {

            const priority =
              getPriority(
                transfer
              );


            const decision =
              managerDecisions[
                transfer.id
              ];


            return (

              <div
                className="transfer-card"
                key={transfer.id}
              >

                {/* IMAGE */}

                <div className="transfer-image">

                  <img
                    src={
                      transfer.image
                    }
                    alt={
                      transfer.product
                    }
                  />

                  <span
                    className={`transfer-priority ${priority.className}`}
                  >
                    {priority.label}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="transfer-content">

                  <div className="transfer-product-header">

                    <div>

                      <h3>
                        {transfer.product}
                      </h3>

                      <span>
                        {transfer.category}
                      </span>

                    </div>


                    <div className="transfer-quantity">

                      <span>
                        Suggested
                      </span>

                      <strong>
                        {
                          transfer.suggestedQuantity
                        }
                      </strong>

                      <small>
                        units
                      </small>

                    </div>

                  </div>


                  {/* STORE FLOW */}

                  <div className="store-flow">

                    <div className="store-box">

                      <div className="store-icon">

                        <MapPin
                          size={14}
                        />

                      </div>

                      <div>

                        <span>
                          From
                        </span>

                        <strong>
                          {
                            transfer.fromStore
                          }
                        </strong>

                      </div>

                    </div>


                    <div className="flow-arrow">

                      <ArrowLeftRight
                        size={18}
                      />

                    </div>


                    <div className="store-box">

                      <div className="store-icon destination">

                        <MapPin
                          size={14}
                        />

                      </div>

                      <div>

                        <span>
                          To
                        </span>

                        <strong>
                          {
                            transfer.toStore
                          }
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* DEMAND COMPARISON */}

                  <div className="demand-comparison">

                    <div className="demand-column">

                      <span>
                        Source Actual
                      </span>

                      <strong>
                        {
                          transfer.sourceActualSales
                        }
                      </strong>

                      <small>
                        units sold
                      </small>

                    </div>


                    <div className="demand-column">

                      <span>
                        Source Stock
                      </span>

                      <strong>
                        {
                          transfer.availableStock
                        }
                      </strong>

                      <small>
                        remaining
                      </small>

                    </div>


                    <div className="demand-column">

                      <span>
                        Destination Demand
                      </span>

                      <strong className="destination-demand">

                        {
                          transfer.destinationPredictedDemand
                        }

                      </strong>

                      <small>
                        predicted
                      </small>

                    </div>


                    <div className="demand-column">

                      <span>
                        Demand Gap
                      </span>

                      <strong className="demand-difference">

                        +
                        {
                          transfer.destinationDemandGap
                        }

                      </strong>

                      <small>
                        units
                      </small>

                    </div>

                  </div>


                  {/* REASON */}

                  <div className="transfer-reason">

                    <TrendingUp
                      size={14}
                    />

                    <span>

                      Destination store has
                      {" "}

                      <strong>
                        {
                          transfer.destinationDemandGap
                        }
                      </strong>

                      {" "}
                      units of unmet predicted
                      demand while source store
                      has remaining stock.

                    </span>

                  </div>


                  {/* STATUS */}

                  {decision && (

                    <div
                      className={
                        decision ===
                        "approved"
                          ? "transfer-decision approved"
                          : "transfer-decision rejected"
                      }
                    >

                      {decision ===
                      "approved" ? (

                        <>
                          <CheckCircle2
                            size={14}
                          />

                          <span>
                            Transfer Approved
                          </span>
                        </>

                      ) : (

                        <>
                          <XCircle
                            size={14}
                          />

                          <span>
                            Transfer Rejected
                          </span>
                        </>

                      )}

                    </div>

                  )}


                  {/* REVIEW */}

                  {!decision && (

                    <button
                      type="button"
                      className="review-transfer-button"
                      onClick={() =>
                        handleReview(
                          transfer
                        )
                      }
                    >
                      Review Transfer
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

      {filteredTransfers.length === 0 && (

        <div className="transfer-empty">

          {transferEnabled ? (

            <>

              <CheckCircle2
                size={30}
              />

              <strong>
                No transfer recommendations
              </strong>

              <span>
                There are currently no suitable
                inter-store transfer opportunities.
              </span>

            </>

          ) : (

            <>

              <AlertTriangle
                size={30}
              />

              <strong>
                Transfer recommendations are disabled
              </strong>

              <span>
                Enable transfer recommendations
                from Settings to generate
                transfer opportunities.
              </span>

            </>

          )}

        </div>

      )}


      {/* =========================
          MODAL
      ========================= */}

      <Modal
        isOpen={isModalOpen}
        title="Manager Transfer Review"
        onClose={
          handleCloseModal
        }
      >

        {selectedTransfer && (

          <div className="transfer-modal">

            {/* PRODUCT */}

            <div className="modal-transfer-product">

              <img
                src={
                  selectedTransfer.image
                }
                alt={
                  selectedTransfer.product
                }
              />

              <div>

                <h3>
                  {
                    selectedTransfer.product
                  }
                </h3>

                <span>
                  {
                    selectedTransfer.category
                  }
                </span>

              </div>

            </div>


            {/* STORE ROUTE */}

            <div className="modal-store-route">

              <div>

                <span>
                  From
                </span>

                <strong>
                  {
                    selectedTransfer.fromStore
                  }
                </strong>

              </div>


              <ArrowLeftRight
                size={20}
              />


              <div>

                <span>
                  To
                </span>

                <strong>
                  {
                    selectedTransfer.toStore
                  }
                </strong>

              </div>

            </div>


            {/* STATS */}

            <div className="modal-transfer-stats">

              <div>

                <span>
                  Source Stock
                </span>

                <strong>
                  {
                    selectedTransfer.availableStock
                  }
                </strong>

              </div>


              <div>

                <span>
                  Destination Demand
                </span>

                <strong>
                  {
                    selectedTransfer.destinationPredictedDemand
                  }
                </strong>

              </div>


              <div>

                <span>
                  Suggested Quantity
                </span>

                <strong>
                  {
                    selectedTransfer.suggestedQuantity
                  }
                </strong>

              </div>

            </div>


            {/* REASON */}

            <div className="modal-transfer-reason">

              <TrendingUp
                size={15}
              />

              <span>

                Destination demand is higher
                than current actual sales by
                {" "}

                <strong>
                  {
                    selectedTransfer.destinationDemandGap
                  }
                </strong>

                {" "}
                units.

              </span>

            </div>


            {/* DECISION */}

            <div className="transfer-manager-decision">

              <p>
                Manager Decision
              </p>

              <div>

                <button
                  type="button"
                  className="approve-transfer"
                  onClick={() =>
                    handleDecision(
                      selectedTransfer.id,
                      "approved"
                    )
                  }
                >

                  <CheckCircle2
                    size={15}
                  />

                  Approve Transfer

                </button>


                <button
                  type="button"
                  className="reject-transfer"
                  onClick={() =>
                    handleDecision(
                      selectedTransfer.id,
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


export default Transfers;