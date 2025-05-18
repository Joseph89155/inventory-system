// src/App.jsx
import { Routes, Route } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import Layout from "./components/Layout";

// Your page components
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Tooltip.Provider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="sales" element={<Sales />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Tooltip.Provider>
  );
};

export default App;
