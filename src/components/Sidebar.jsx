import "../styles/components/sidebar.css";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Brain,
  Clock3,
  Tag,
  ArrowLeftRight,
  BarChart3,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: Package,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: ShoppingCart,
    },
    {
      name: "Predictions",
      path: "/predictions",
      icon: Brain,
    },
    {
      name: "Near Expiry",
      path: "/near-expiry",
      icon: Clock3,
    },
    {
      name: "Discounts",
      path: "/discounts",
      icon: Tag,
    },
    {
      name: "Transfers",
      path: "/transfers",
      icon: ArrowLeftRight,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="logo-box">
          Q
        </div>

        <div>
          <h2>QuickStock</h2>
          <span>
            Waste Management
          </span>
        </div>

      </div>

      <nav className="sidebar-menu">

        <p className="menu-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-link"
              activeClassName="active"
            >

              <Icon size={18} />

              <span>{item.name}</span>

            </NavLink>
          );
        })}

      </nav>

      <div className="sidebar-footer">

        <div className="system-status">

          <span className="status-dot"></span>

          <div>
            <strong>
              System Active
            </strong>

            <span>
              All stores connected
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;