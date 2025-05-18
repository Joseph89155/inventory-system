import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ← Import for navigation
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import Switch from "../components/ui/switch";
import Select from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [salesSummary, setSalesSummary] = useState("weekly");
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [currency, setCurrency] = useState("$");
  const [taxRate, setTaxRate] = useState(0);
  const [discountEnabled, setDiscountEnabled] = useState(true);
  const [anonymousReporting, setAnonymousReporting] = useState(false);
  const [autoLogout, setAutoLogout] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleResetData = () => {
    localStorage.removeItem("sales");
    localStorage.removeItem("inventory");
    alert("Data reset!");
  };

  const handleImportData = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        const data = JSON.parse(fileReader.result);
        if (data.sales) localStorage.setItem("sales", JSON.stringify(data.sales));
        if (data.inventory) localStorage.setItem("inventory", JSON.stringify(data.inventory));
        alert("Data imported!");
      } catch {
        alert("Invalid file.");
      }
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const handleExportData = () => {
    const sales = JSON.parse(localStorage.getItem("sales") || "[]");
    const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
    const data = { sales, inventory };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "backup.json";
    link.click();
  };

  const handleClearPersonalData = () => {
    setName("");
    setEmail("");
    setProfilePic(null);
    alert("Personal data cleared");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-gray-800 dark:text-gray-100">
      {/* Top Navigation Bar */}
      <nav className="flex justify-center gap-4 mb-6 text-blue-600 dark:text-blue-400 font-medium">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/inventory" className="hover:underline">Inventory</Link>
        <Link to="/sales" className="hover:underline">Sales</Link>
        <Link to="/reports" className="hover:underline">Reports</Link>
        <Link to="/settings" className="hover:underline">Settings</Link>
      </nav>

      <h1 className="text-3xl font-bold text-center mb-4">Settings</h1>

      {/* User Profile */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
          <Button>Change Password</Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardContent className="space-y-2">
          <h2 className="text-xl font-semibold">Appearance</h2>
          <label className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </label>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Data Management</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleResetData} className="bg-red-600 hover:bg-red-700 text-white">Reset Data</Button>
            <Button onClick={handleExportData}>Export Data</Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <label className="flex items-center justify-between">
            <span>Auto Backup</span>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </label>
        </CardContent>
      </Card>

      {/* Smart Settings */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Smart Settings</h2>
          <label className="flex items-center justify-between">
            <span>Low Stock Alerts</span>
            <Switch checked={lowStockAlert} onCheckedChange={setLowStockAlert} />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={salesSummary} onValueChange={setSalesSummary}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
            <Input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              placeholder="Low Stock Threshold"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Change Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="KSh">KES (KSh)</option>
            </select>
          </div>

          <Input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            placeholder="Default Tax Rate %"
          />
          <label className="flex items-center justify-between">
            <span>Enable Discounts</span>
            <Switch checked={discountEnabled} onCheckedChange={setDiscountEnabled} />
          </label>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Security & Privacy</h2>
          <label className="flex items-center justify-between">
            <span>Anonymized Reporting</span>
            <Switch checked={anonymousReporting} onCheckedChange={setAnonymousReporting} />
          </label>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleClearPersonalData}>
            Clear Personal Data
          </Button>
          <label className="flex items-center justify-between">
            <span>Auto Logout</span>
            <Switch checked={autoLogout} onCheckedChange={setAutoLogout} />
          </label>
          <label className="flex items-center justify-between">
            <span>Remember Device</span>
            <Switch checked={rememberDevice} onCheckedChange={setRememberDevice} />
          </label>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
