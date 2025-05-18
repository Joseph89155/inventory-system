// src/components/Layout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        } p-6 bg-gray-50 min-h-screen w-full`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
