import React, { useEffect, useState } from "react";

import {
  AlertTriangle,
  Clock3,
  Package,
  Search,
  Tag,
} from "lucide-react";

import products from "../data/products.json";

import StoreSelector from "../components/StoreSelector";

import { getSettings } from "../services/settingsService";

import "../styles/pages/near-expiry.css";


const NearExpiry = () => {

  const [selectedStore, setSelectedStore] =
    useState("All Stores");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState(new Date());


  /* =========================
     SETTINGS
  ========================= */

  const [expiryThreshold, setExpiryThreshold] =
    useState(
      getSettings().expiryThreshold
    );


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
     CONTINUOUS TIMER
  ========================= */

  useEffect(() => {

    const timer =
      setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);


    return () => {
      clearInterval(timer);
    };

  }, []);


  /* =========================
     REFRESH SETTINGS
  ========================= */

  useEffect(() => {

    const handleStorageChange = () => {

      const settings =
        getSettings();

      setExpiryThreshold(
        settings.expiryThreshold
      );

    };


    window.addEventListener(
      "storage",
      handleStorageChange
    );


    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);


  /* =========================
     CALCULATE TIME LEFT
  ========================= */

  const calculateTimeLeft = (
    expiryDate
  ) => {

    const expiry =
      new Date(expiryDate);

    const difference =
      expiry.getTime() -
      currentTime.getTime();


    if (difference <= 0) {

      return {
        expired: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHours: 0,
      };

    }


    const days =
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      );


    const hours =
      Math.floor(
        (difference %
          (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );


    const minutes =
      Math.floor(
        (difference %
          (1000 * 60 * 60)) /
          (1000 * 60)
      );


    const seconds =
      Math.floor(
        (difference %
          (1000 * 60)) /
          1000
      );


    const totalHours =
      difference /
      (1000 * 60 * 60);


    return {
      expired: false,
      days,
      hours,
      minutes,
      seconds,
      totalHours,
    };

  };


  /* =========================
     FILTER PRODUCTS
  ========================= */

  const nearExpiryProducts =
    products.filter(
      (product) => {

        const timeLeft =
          calculateTimeLeft(
            product.expiryDate
          );


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


        /*
          Products within the
          manager-defined threshold
          are considered near expiry.
        */

        const isNearExpiry =
          !timeLeft.expired &&
          timeLeft.totalHours <=
            expiryThreshold;


        return (
          matchesStore &&
          matchesSearch &&
          isNearExpiry
        );

      }
    );


  /* =========================
     PRIORITY
  ========================= */

  const getPriority = (
    totalHours
  ) => {

    if (totalHours <= 12) {

      return {
        label: "Critical",
        className: "critical",
      };

    }


    if (totalHours <= 24) {

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
     SUMMARY
  ========================= */

  const criticalProducts =
    nearExpiryProducts.filter(
      (product) =>
        calculateTimeLeft(
          product.expiryDate
        ).totalHours <= 12
    ).length;


  const highPriorityProducts =
    nearExpiryProducts.filter(
      (product) => {

        const hours =
          calculateTimeLeft(
            product.expiryDate
          ).totalHours;

        return (
          hours > 12 &&
          hours <= 24
        );

      }
    ).length;


  const totalRemainingUnits =
    nearExpiryProducts.reduce(
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


  return (
    <div className="near-expiry-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="near-expiry-header">

        <div className="near-expiry-title">

          <div className="near-expiry-title-icon">

            <AlertTriangle
              size={21}
            />

          </div>

          <div>

            <h1>
              Near Expiry
            </h1>

            <p>
              Monitor products approaching
              their expiry time.
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

      <div className="expiry-info">

        <div className="expiry-info-icon">

          <Clock3 size={18} />

        </div>

        <div>

          <strong>
            Live Expiry Monitoring
          </strong>

          <p>
            Products with less than{" "}
            {expiryThreshold} hours
            remaining before expiry are
            shown here. The timer updates
            every second.
          </p>

        </div>

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="near-expiry-summary">

        <div className="near-expiry-summary-card">

          <div className="near-expiry-summary-icon red">

            <AlertTriangle size={19} />

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

            <small>
              Products within{" "}
              {expiryThreshold} hours
            </small>

          </div>

        </div>


        <div className="near-expiry-summary-card">

          <div className="near-expiry-summary-icon critical">

            <AlertTriangle size={19} />

          </div>

          <div>

            <span>
              Critical
            </span>

            <strong>
              {criticalProducts}
            </strong>

            <small>
              Less than 12 hours
            </small>

          </div>

        </div>


        <div className="near-expiry-summary-card">

          <div className="near-expiry-summary-icon orange">

            <Clock3 size={19} />

          </div>

          <div>

            <span>
              High Priority
            </span>

            <strong>
              {highPriorityProducts}
            </strong>

            <small>
              12–24 hours remaining
            </small>

          </div>

        </div>


        <div className="near-expiry-summary-card">

          <div className="near-expiry-summary-icon blue">

            <Package size={19} />

          </div>

          <div>

            <span>
              Remaining Stock
            </span>

            <strong>
              {totalRemainingUnits}
            </strong>

            <small>
              Units requiring attention
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="near-expiry-toolbar">

        <div>

          <h2>
            Expiring Products
          </h2>

          <span>
            Live countdown
          </span>

        </div>


        <div className="near-expiry-search">

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

      <div className="near-expiry-list">

        {nearExpiryProducts.map(
          (product) => {

            const timeLeft =
              calculateTimeLeft(
                product.expiryDate
              );


            const priority =
              getPriority(
                timeLeft.totalHours
              );


            const remainingStock =
              Math.max(
                product.stock -
                  product.actualSales,
                0
              );


            return (

              <div
                className="near-expiry-card"
                key={product.id}
              >

                {/* IMAGE */}

                <div className="near-expiry-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <span
                    className={`expiry-priority ${priority.className}`}
                  >
                    {priority.label}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="near-expiry-content">

                  <div className="near-expiry-product-header">

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


                    <div className="expiry-countdown">

                      <Clock3 size={15} />

                      <div>

                        <small>
                          Time Remaining
                        </small>

                        <strong>

                          {timeLeft.days > 0 &&
                            `${timeLeft.days}d `}

                          {String(
                            timeLeft.hours
                          ).padStart(
                            2,
                            "0"
                          )}
                          :

                          {String(
                            timeLeft.minutes
                          ).padStart(
                            2,
                            "0"
                          )}
                          :

                          {String(
                            timeLeft.seconds
                          ).padStart(
                            2,
                            "0"
                          )}

                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* PRODUCT DETAILS */}

                  <div className="expiry-details">

                    <div>

                      <span>
                        Price
                      </span>

                      <strong>
                        ₹{product.price}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Stock
                      </span>

                      <strong>
                        {product.stock}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Sold
                      </span>

                      <strong>
                        {product.actualSales}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Remaining
                      </span>

                      <strong className="remaining-stock">
                        {remainingStock}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Predicted Sales
                      </span>

                      <strong>
                        {product.predictedSales}
                      </strong>

                    </div>

                  </div>


                  {/* SALES GAP */}

                  <div className="expiry-sales-gap">

                    <div>

                      <span>
                        Predicted Sales
                      </span>

                      <strong>
                        {product.predictedSales}
                      </strong>

                    </div>


                    <div className="gap-arrow">
                      →
                    </div>


                    <div>

                      <span>
                        Actual Sales
                      </span>

                      <strong>
                        {product.actualSales}
                      </strong>

                    </div>


                    <div className="sales-gap-value">

                      <Tag size={14} />

                      <span>

                        {Math.max(
                          product.predictedSales -
                            product.actualSales,
                          0
                        )}

                        {" "}
                        below prediction

                      </span>

                    </div>

                  </div>


                  {/* ACTION */}

                  <div className="expiry-action">

                    <div>

                      <AlertTriangle
                        size={14}
                      />

                      <span>
                        Manager review required
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        console.log(
                          "Review:",
                          product
                        )
                      }
                    >
                      Review Product
                    </button>

                  </div>

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* =========================
          EMPTY STATE
      ========================= */}

      {nearExpiryProducts.length === 0 && (

        <div className="near-expiry-empty">

          <Package size={30} />

          <strong>
            No near-expiry products
          </strong>

          <span>
            There are currently no products
            within the{" "}
            {expiryThreshold}-hour expiry
            threshold.
          </span>

        </div>

      )}

    </div>
  );
};


export default NearExpiry;