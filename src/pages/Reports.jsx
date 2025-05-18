import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { LineChart, BarChart, PieChart } from "../components/Charts";
import DateRangePicker from "../components/ui/date-range-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import downloadCSV from "../utils/export";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    const savedInventory = JSON.parse(localStorage.getItem("inventory") || "[]");
    setSales(savedSales);
    setInventory(savedInventory);
  }, []);

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const from = dateRange.from ? new Date(dateRange.from) : null;
    const to = dateRange.to ? new Date(dateRange.to) : null;
    return (
      (!from || saleDate >= from) &&
      (!to || saleDate <= to) &&
      (sale.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalSales = filteredSales.reduce((acc, sale) => acc + Number(sale.price || 0), 0);
  const numberOfSales = filteredSales.length;

  const topProduct = filteredSales.reduce((top, current) => {
    const freq = filteredSales.filter(s => s.name === current.name).length;
    return freq > top.freq ? { name: current.name, freq } : top;
  }, { name: "", freq: 0 });

  const inventoryValue = inventory.reduce(
    (acc, item) => acc + ((item.quantity || 0) * (item.price || 0)), 0
  );

  const lowStockItems = inventory.filter(item => item.quantity < 10);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 10, 10);
    autoTable(doc, {
      head: [["Product", "Date", "Quantity", "Price"]],
      body: filteredSales.map(s => [s.name, s.date, s.quantity, s.price])
    });
    doc.save("sales_report.pdf");
  };

  const exportCSV = () => downloadCSV(filteredSales, "sales_report.csv");

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Reports</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
          <Link to="/inventory" className="text-blue-600 hover:underline">Inventory</Link>
          <Link to="/sales" className="text-blue-600 hover:underline">Sales</Link>
          <Link to="/reports" className="text-blue-800 font-semibold underline">Reports</Link>
          <Link to="/settings" className="text-blue-600 hover:underline">Settings</Link>
        </nav>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent><h2>Total Sales</h2><p>${totalSales.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent><h2>Number of Sales</h2><p>{numberOfSales}</p></CardContent></Card>
        <Card><CardContent><h2>Top Product</h2><p>{topProduct.name || "N/A"}</p></CardContent></Card>
        <Card><CardContent><h2>Inventory Value</h2><p>${inventoryValue.toFixed(2)}</p></CardContent></Card>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-wrap gap-4 mb-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <Input
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Button onClick={exportPDF} className="bg-red-600 text-white">Export PDF</Button>
        <Button onClick={exportCSV} className="bg-green-600 text-white">Export CSV</Button>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <LineChart data={filteredSales} xKey="date" yKey="price" title="Sales Over Time" />
        <BarChart data={filteredSales} xKey="name" yKey="quantity" title="Top Selling Products" />
        <PieChart data={filteredSales} groupKey="name" valueKey="price" title="Sales by Product" />
        <BarChart data={inventory} xKey="name" yKey="quantity" title="Inventory Levels" />
      </div>

      {/* Stock Warnings */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-2">Low Stock Items</h2>
        <ul className="list-disc ml-6">
          {lowStockItems.map((item, idx) => (
            <li key={idx}>{item.name} - {item.quantity} left</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mt-4 mb-2">Out of Stock Items</h2>
        <ul className="list-disc ml-6">
          {outOfStockItems.map((item, idx) => (
            <li key={idx}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;
