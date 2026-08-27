import React from "react";
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// =========================
// LAYOUT
// =========================

import DashboardLayout from "./components/DashboardLayout";

// =========================
// PAGES
// =========================

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Predictions from "./pages/Predictions";
import NearExpiry from "./pages/NearExpiry";
import Discounts from "./pages/Discounts";
import Transfers from "./pages/Transfers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// =========================
// GLOBAL CSS
// =========================

import "./styles/global.css";

function App() {
  return (
    <DashboardLayout>

      <Switch>

        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          exact
          path="/dashboard"
          component={Dashboard}
        />

        {/* =========================
            INVENTORY
        ========================= */}

        <Route
          exact
          path="/inventory"
          component={Inventory}
        />

        {/* =========================
            SALES
        ========================= */}

        <Route
          exact
          path="/sales"
          component={Sales}
        />

        {/* =========================
            PREDICTIONS
        ========================= */}

        <Route
          exact
          path="/predictions"
          component={Predictions}
        />

        {/* =========================
            NEAR EXPIRY
        ========================= */}

        <Route
          exact
          path="/near-expiry"
          component={NearExpiry}
        />

        {/* =========================
            DISCOUNTS
        ========================= */}

        <Route
          exact
          path="/discounts"
          component={Discounts}
        />

        {/* =========================
            TRANSFERS
        ========================= */}

        <Route
          exact
          path="/transfers"
          component={Transfers}
        />

        {/* =========================
            REPORTS
        ========================= */}

        <Route
          exact
          path="/reports"
          component={Reports}
        />

        {/* =========================
            SETTINGS
        ========================= */}

        <Route
          exact
          path="/settings"
          component={Settings}
        />

        {/* =========================
            DEFAULT ROUTE
        ========================= */}

        <Redirect
          exact
          from="/"
          to="/dashboard"
        />

        {/* =========================
            PAGE NOT FOUND
        ========================= */}

        <Route>
          <div
            style={{
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h2>
              Page Not Found
            </h2>

            <p>
              The page you are looking for
              does not exist.
            </p>
          </div>
        </Route>

      </Switch>

    </DashboardLayout>
  );
}

export default App;