import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import KpiCard from "../components/KpiCard"; // adjust path if needed

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [lowStock, setLowStock] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
    setTotalValue(
      stored.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
    setLowStock(stored.filter((item) => item.quantity < 10));

    const categoryMap = {};
    stored.forEach((item) => {
      categoryMap[item.category] =
        (categoryMap[item.category] || 0) + item.quantity;
    });
    const catData = Object.entries(categoryMap).map(([key, value]) => ({
      name: key || "Uncategorized",
      value,
    }));
    setCategoryData(catData);

    setRecentActivity(
      stored.slice(-5).map((item) => `Updated ${item.name} - ${item.quantity} pcs`)
    );

    const sortedBySales = [...stored].sort((a, b) => (b.sales || 0) - (a.sales || 0));
    setTopSelling(sortedBySales.slice(0, 5));

    const soonExpiring = stored.filter((item) => {
      const expiry = new Date(item.expiryDate);
      const now = new Date();
      const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
      return diffDays < 30 && diffDays > 0;
    });
    setExpiringSoon(soonExpiring);
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const containerClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black";

 return (
    <div className={`p-6 min-h-screen ${containerClass}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>

{/* KPI Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
  <KpiCard icon="📦" title="Total Products" value={products.length} color="blue" />
<KpiCard icon="💰" title="Inventory Value" value={`$${totalValue.toLocaleString()}`} color="green" />
<KpiCard icon="🧾" title="Total Sales" value="—" color="gray" />
<KpiCard
  icon="⚠️"
  title="Low Stock"
  value={lowStock.length === 0 ? "All Good 🎉" : lowStock.length}
  color={lowStock.length === 0 ? "green" : "red"}
/>
</div>

      {/* Filters */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter:</label>
        {['all', 'today', 'week', 'month'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeFilter(range)}
            className={`px-3 py-1 rounded mr-2 ${timeFilter === range ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Stock by Category (Bar)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Category Distribution (Pie)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Low Stock */}
      {lowStock.length > 0 && (
        <Section title="Low Stock Alerts" color="text-red-600">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Product</th>
                <th>Category</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.slice(0, 5).map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2">{item.name}</td>
                  <td>{item.category}</td>
                  <td className="text-red-500">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/inventory" className="text-blue-600 underline mt-2 inline-block">
            View Full Inventory
          </Link>
        </Section>
      )}

      {/* Expiring Soon */}
      {expiringSoon.length > 0 && (
        <Section title="Expiring Soon" color="text-yellow-600">
          <ul className="list-disc pl-5">
            {expiringSoon.map((item, idx) => (
              <li key={idx}>{item.name} — expires on {item.expiryDate}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Top Selling */}
      <Section title="Top-Selling Products" color="text-green-600">
        <ol className="list-decimal pl-5">
          {topSelling.map((item, i) => (
            <li key={i}>{item.name} — {item.sales || 0} units sold</li>
          ))}
        </ol>
        <Link to="/sales" className="text-blue-600 underline mt-2 inline-block">
          Go to Sales Overview
        </Link>
      </Section>

      {/* Recent Activity */}
      <Section title="Recent Activity Log" color="text-blue-600">
        <ul className="list-disc pl-5">
          {recentActivity.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </Section>

      {/* Smart Insight */}
      <Section title="Smart Insight" color="text-purple-600">
        <p>
          You have {products.length} total products, {lowStock.length} are low in stock, and {expiringSoon.length} expiring soon.
        </p>
      </Section>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Link to="/inventory" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Manage Inventory
        </Link>
        <Link to="/sales" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          View Sales
        </Link>
        <Link to="/reports" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Generate Reports
        </Link>
      </div>
    </div>
  );
};

const Section = ({ title, children, color }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h2>
    {children}
  </motion.div>
);

export default Dashboard;