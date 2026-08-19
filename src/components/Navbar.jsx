import "../styles/components/navbar.css";

import {
  Bell,
  CalendarDays,
} from "lucide-react";

const Navbar = () => {
  return (
    <header className="navbar">

      <div className="navbar-left">

        <div>
          <h2>
            Quick Commerce
          </h2>

          <p>
            Inventory Decision Support System
          </p>
        </div>

      </div>

      <div className="navbar-right">

        <div className="navbar-date">

          <CalendarDays size={15} />

          <span>
            19 August 2026
          </span>

        </div>

        <button className="notification-button">
          <Bell size={18} />
        </button>

        <div className="manager-profile">

          <div className="manager-avatar">
            M
          </div>

          <div className="manager-info">

            <strong>
              Manager
            </strong>

            <span>
              Store Manager
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;