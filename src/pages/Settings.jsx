import React, { useState } from "react";

import {
  Settings as SettingsIcon,
  Clock3,
  Tag,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import {
  getSettings,
  saveSettings,
  resetSettings,
} from "../services/settingsService";

import "../styles/pages/settings.css";


const Settings = () => {

  /* =========================
     SETTINGS STATE
  ========================= */

  const savedSettings = getSettings();

const [expiryThreshold, setExpiryThreshold] =
  useState(savedSettings.expiryThreshold);

const [discountEnabled, setDiscountEnabled] =
  useState(savedSettings.discountEnabled);

const [transferEnabled, setTransferEnabled] =
  useState(savedSettings.transferEnabled);

const [notificationsEnabled, setNotificationsEnabled] =
  useState(savedSettings.notificationsEnabled);

const [discountThreshold, setDiscountThreshold] =
  useState(savedSettings.discountThreshold);

const [saved, setSaved] =
  useState(false);


  /* =========================
     SAVE SETTINGS
  ========================= */

  const handleSave = () => {

    const settings = {
      expiryThreshold,
      discountEnabled,
      transferEnabled,
      notificationsEnabled,
      discountThreshold,
    };

    saveSettings(settings);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };


  /* =========================
     RESET SETTINGS
  ========================= */

  const handleReset = () => {

    setExpiryThreshold(48);

    setDiscountEnabled(true);

    setTransferEnabled(true);

    setNotificationsEnabled(true);

    setDiscountThreshold(10);

    resetSettings();

    setSaved(false);
  };


  return (
    <div className="settings-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="settings-header">

        <div className="settings-title">

          <div className="settings-title-icon">

            <SettingsIcon size={21} />

          </div>

          <div>

            <h1>
              Settings
            </h1>

            <p>
              Configure inventory monitoring
              and decision-support rules.
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {saved && (

        <div className="settings-success">

          <CheckCircle2 size={17} />

          <span>
            Settings saved successfully.
          </span>

        </div>

      )}


      {/* =========================
          SETTINGS GRID
      ========================= */}

      <div className="settings-grid">


        {/* =========================
            EXPIRY SETTINGS
        ========================= */}

        <div className="settings-panel">

          <div className="settings-panel-header">

            <div className="settings-panel-icon blue">

              <Clock3 size={18} />

            </div>

            <div>

              <h2>
                Expiry Monitoring
              </h2>

              <span>
                Configure near-expiry threshold.
              </span>

            </div>

          </div>


          <div className="settings-field">

            <label>
              Near-expiry threshold
            </label>

            <div className="settings-input-row">

              <input
                type="number"
                min="1"
                max="168"
                value={expiryThreshold}
                onChange={(e) =>
                  setExpiryThreshold(
                    Number(e.target.value)
                  )
                }
              />

              <span>
                hours
              </span>

            </div>

            <small>
              Products within this number of
              hours before expiry will be
              considered near expiry.
            </small>

          </div>

        </div>


        {/* =========================
            DISCOUNT SETTINGS
        ========================= */}

        <div className="settings-panel">

          <div className="settings-panel-header">

            <div className="settings-panel-icon orange">

              <Tag size={18} />

            </div>

            <div>

              <h2>
                Discount Decision Support
              </h2>

              <span>
                Configure discount recommendations.
              </span>

            </div>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                Enable discount recommendations
              </strong>

              <span>
                Show products whose actual sales
                are below predicted sales.
              </span>

            </div>


            <button
              type="button"
              className={
                discountEnabled
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setDiscountEnabled(
                  !discountEnabled
                )
              }
            >

              <span></span>

            </button>

          </div>


          <div className="settings-field">

            <label>
              Minimum recommended discount
            </label>

            <div className="settings-input-row">

              <input
                type="number"
                min="1"
                max="90"
                value={discountThreshold}
                onChange={(e) =>
                  setDiscountThreshold(
                    Number(e.target.value)
                  )
                }
              />

              <span>
                %
              </span>

            </div>

            <small>
              This value is used as the minimum
              discount recommendation.
            </small>

          </div>

        </div>


        {/* =========================
            TRANSFER SETTINGS
        ========================= */}

        <div className="settings-panel">

          <div className="settings-panel-header">

            <div className="settings-panel-icon green">

              <RotateCcw size={18} />

            </div>

            <div>

              <h2>
                Inter-Store Transfers
              </h2>

              <span>
                Configure transfer decision support.
              </span>

            </div>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                Enable transfer recommendations
              </strong>

              <span>
                Identify possible stock movement
                between stores.
              </span>

            </div>


            <button
              type="button"
              className={
                transferEnabled
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setTransferEnabled(
                  !transferEnabled
                )
              }
            >

              <span></span>

            </button>

          </div>


          <div className="settings-rule">

            <strong>
              Transfer rule
            </strong>

            <span>
              Source store must have remaining
              stock and destination store must
              have unmet predicted demand.
            </span>

          </div>

        </div>


        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div className="settings-panel">

          <div className="settings-panel-header">

            <div className="settings-panel-icon purple">

              <Bell size={18} />

            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <span>
                Configure system notifications.
              </span>

            </div>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                Enable notifications
              </strong>

              <span>
                Show alerts for important inventory
                conditions.
              </span>

            </div>


            <button
              type="button"
              className={
                notificationsEnabled
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setNotificationsEnabled(
                  !notificationsEnabled
                )
              }
            >

              <span></span>

            </button>

          </div>


          <div className="settings-notification-list">

            <div>

              <span>
                Near-expiry alerts
              </span>

              <strong>
                Enabled
              </strong>

            </div>

            <div>

              <span>
                Discount review alerts
              </span>

              <strong>
                Manager Review
              </strong>

            </div>

            <div>

              <span>
                Transfer alerts
              </span>

              <strong>
                Manager Review
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          RESEARCH RULES
      ========================= */}

      <div className="settings-panel settings-research-panel">

        <div className="settings-panel-header">

          <div className="settings-panel-icon blue">

            <SettingsIcon size={18} />

          </div>

          <div>

            <h2>
              Research Decision Rules
            </h2>

            <span>
              Current system logic used by the
              frontend prototype.
            </span>

          </div>

        </div>


        <div className="settings-rules-grid">

          <div>

            <strong>
              01
            </strong>

            <span>
              Prediction Comparison
            </span>

            <small>
              Compare actual daily sales with
              predicted sales.
            </small>

          </div>


          <div>

            <strong>
              02
            </strong>

            <span>
              Discount Candidate
            </span>

            <small>
              If actual sales remain below
              prediction and stock remains,
              recommend the product for
              manager review.
            </small>

          </div>


          <div>

            <strong>
              03
            </strong>

            <span>
              Transfer Candidate
            </span>

            <small>
              If one store has available stock
              and another has unmet predicted
              demand, suggest a transfer.
            </small>

          </div>


          <div>

            <strong>
              04
            </strong>

            <span>
              Manager Control
            </span>

            <small>
              Discount and transfer actions
              require manager approval.
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          ACTIONS
      ========================= */}

      <div className="settings-actions">

        <button
          type="button"
          className="settings-reset-button"
          onClick={handleReset}
        >

          <RotateCcw size={15} />

          Reset

        </button>


        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
        >

          <Save size={15} />

          Save Settings

        </button>

      </div>

    </div>
  );
};


export default Settings;