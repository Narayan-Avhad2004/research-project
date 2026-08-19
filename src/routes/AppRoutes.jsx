import React from "react";

import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Sales from "../pages/Sales";
import Predictions from "../pages/Predictions";
import NearExpiry from "../pages/NearExpiry";
import Discounts from "../pages/Discounts";
import Transfers from "../pages/Transfers";
import Reports from "../pages/Reports";


const AppLayout = () => {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-area">

        <Navbar />

        <main className="content-area">

          <Switch>

            <Route
              exact
              path="/dashboard"
              component={Dashboard}
            />

            <Route
              exact
              path="/inventory"
              component={Inventory}
            />

            <Route
              exact
              path="/sales"
              component={Sales}
            />

            <Route
              exact
              path="/predictions"
              component={Predictions}
            />

            <Route
              exact
              path="/near-expiry"
              component={NearExpiry}
            />

            <Route
              exact
              path="/discounts"
              component={Discounts}
            />

            <Route
              exact
              path="/transfers"
              component={Transfers}
            />

            <Route
              exact
              path="/reports"
              component={Reports}
            />

            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>

            <Route path="*">
              <Redirect to="/dashboard" />
            </Route>

          </Switch>

        </main>

      </div>

    </div>
  );
};


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};


export default AppRoutes;