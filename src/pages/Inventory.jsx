import React, { useState } from "react";

import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import StoreSelector from "../components/StoreSelector";

import products from "../data/products.json";

import "../styles/pages/inventory.css";

const Inventory = () => {
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

  /*
    Filter products by store and search
  */

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


  /*
    Inventory statistics
  */

  const totalProducts =
    filteredProducts.length;

  const totalStock =
    filteredProducts.reduce(
      (total, product) =>
        total + product.stock,
      0
    );

  const totalSold =
    filteredProducts.reduce(
      (total, product) =>
        total + product.actualSales,
      0
    );

  const lowStockProducts =
    filteredProducts.filter(
      (product) =>
        product.stock <= 20
    ).length;


  /*
    Stock status
  */

  const getStockStatus = (
    stock
  ) => {

    if (stock <= 10) {
      return {
        label: "Critical",
        className: "critical",
      };
    }

    if (stock <= 20) {
      return {
        label: "Low",
        className: "low",
      };
    }

    return {
      label: "Healthy",
      className: "healthy",
    };
  };


  return (
    <div className="inventory-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="inventory-header">

        <div className="inventory-title">

          <div className="inventory-title-icon">
            <Package size={21} />
          </div>

          <div>

            <h1>
              Inventory
            </h1>

            <p>
              Monitor product stock across
              quick-commerce stores.
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

      <div className="inventory-summary">

        <div className="inventory-summary-card">

          <div className="inventory-summary-icon blue">
            <Package size={19} />
          </div>

          <div>

            <span>
              Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              Products in inventory
            </small>

          </div>

        </div>


        <div className="inventory-summary-card">

          <div className="inventory-summary-icon green">
            <CheckCircle2 size={19} />
          </div>

          <div>

            <span>
              Total Stock
            </span>

            <strong>
              {totalStock}
            </strong>

            <small>
              Available units
            </small>

          </div>

        </div>


        <div className="inventory-summary-card">

          <div className="inventory-summary-icon orange">
            <Package size={19} />
          </div>

          <div>

            <span>
              Units Sold
            </span>

            <strong>
              {totalSold}
            </strong>

            <small>
              Actual sales
            </small>

          </div>

        </div>


        <div className="inventory-summary-card">

          <div className="inventory-summary-icon red">
            <AlertTriangle size={19} />
          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {lowStockProducts}
            </strong>

            <small>
              Need attention
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="inventory-toolbar">

        <div>

          <h2>
            Product Inventory
          </h2>

          <span>
            {filteredProducts.length} products
            displayed
          </span>

        </div>


        <div className="inventory-search">

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

      <div className="inventory-table-container">

        <table className="inventory-table">

          <thead>

            <tr>

              <th>
                Product
              </th>

              <th>
                Category
              </th>

              <th>
                Store
              </th>

              <th>
                Price
              </th>

              <th>
                Stock
              </th>

              <th>
                Actual Sales
              </th>

              <th>
                Predicted Sales
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
                  getStockStatus(
                    product.stock
                  );

                return (
                  <tr
                    key={product.id}
                  >

                    {/* PRODUCT */}

                    <td>

                      <div className="inventory-product">

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
                            ID: #
                            {product.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>
                      <span className="category-text">
                        {product.category}
                      </span>
                    </td>


                    {/* STORE */}

                    <td>
                      {product.store}
                    </td>


                    {/* PRICE */}

                    <td>

                      <strong className="price-text">
                        ₹{product.price}
                      </strong>

                    </td>


                    {/* STOCK */}

                    <td>

                      <strong className="stock-number">
                        {product.stock}
                      </strong>

                    </td>


                    {/* ACTUAL SALES */}

                    <td>
                      {product.actualSales}
                    </td>


                    {/* PREDICTED SALES */}

                    <td>

                      <span className="prediction-number">
                        {product.predictedSales}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`stock-status ${status.className}`}
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


        {/* EMPTY STATE */}

        {filteredProducts.length === 0 && (

          <div className="inventory-empty">

            <Package size={30} />

            <strong>
              No products found
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

export default Inventory;