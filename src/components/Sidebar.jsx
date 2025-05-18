// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart,
  Settings,
  X,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { useDarkMode } from "../context/DarkModeContext";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Sales", path: "/sales", icon: ShoppingCart },
  { name: "Reports", path: "/reports", icon: BarChart },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 h-screen shadow-md fixed top-0 left-0 z-20 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        {!collapsed && (
          <span className="font-bold text-lg whitespace-nowrap">
            📊 Supplement Tracker
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle Sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip.Provider key={item.name} delayDuration={300}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition group",
                        isActive
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                      )
                    }
                  >
                    <Icon
                      className="transition-transform duration-300 group-hover:scale-110"
                      size={20}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                </Tooltip.Trigger>
                {collapsed && (
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      sideOffset={8}
                      className="bg-black text-white px-2 py-1 text-sm rounded shadow-lg"
                    >
                      {item.name}
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </Tooltip.Root>
            </Tooltip.Provider>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
