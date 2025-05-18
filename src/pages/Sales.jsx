import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Navigation
import Button from "../components/ui/button";
import SaleFormModal from "../components/SaleFormModal";
import SaleTable from "../components/SaleTable";

const ITEMS_PER_PAGE = 10;

const Sales = () => {
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("sales");
    return saved ? JSON.parse(saved) : [];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const handleAddSale = (newSale) => {
    const datedSale = {
      ...newSale,
      id: newSale.id || Date.now() + Math.random(),
      date: newSale.date || new Date().toISOString().split("T")[0],
    };
    setSales((prev) => [...prev, datedSale]);
    closeModal();
  };

  const handleUpdateSale = (updatedSale) => {
    setSales((prev) =>
      prev.map((sale, i) => (i === editingIndex ? { ...updatedSale, id: sale.id } : sale))
    );
    closeModal();
  };

  const handleDeleteSale = (indexToDelete) => {
    setSales((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  const handleBulkDelete = (indexes) => {
    setSales((prev) => prev.filter((_, i) => !indexes.includes(i)));
  };

  const handleEditClick = (index, sale) => {
    setEditingIndex(index);
    setEditingSale(sale);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSale(null);
    setEditingIndex(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(sales, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_export.json";
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const updated = imported.map((s) => ({
            ...s,
            date: s.date || new Date().toISOString().split("T")[0],
            id: s.id || Date.now() + Math.random(),
          }));
          setSales((prev) => [...prev, ...updated]);
        }
      } catch (error) {
        alert("Failed to import: Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  const filteredSales = sales.filter((sale) => {
    const productName = (sale.productName || "").toLowerCase();
    const search = (searchTerm || "").toLowerCase();
    const matchesSearch = productName.includes(search);

    const inDateRange =
      (!dateRange.from || new Date(sale.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(sale.date) <= new Date(dateRange.to));

    return matchesSearch && inDateRange;
  });

  const sortedSales = [...filteredSales];
  if (sortConfig.key) {
    sortedSales.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(sortedSales.length / ITEMS_PER_PAGE);
  const paginatedSales = sortedSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-center">Sales Management</h1>

      {/* 🔗 Navigation Links to Other Pages */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ← Back to Dashboard
        </Link>
        <Link to="/inventory" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          View Inventory
        </Link>
        <Link to="/reports" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Generate Reports
        </Link>
      </div>

      <div className="mb-6 text-right">
        <Button onClick={() => setModalOpen(true)}>Add Sale</Button>
      </div>

      <SaleFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editingSale ? handleUpdateSale : handleAddSale}
        editingSale={editingSale}
      />

      <div className="mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by product..."
            className="w-full sm:w-1/3 p-2 rounded border border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="p-2 rounded border"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="p-2 rounded border"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
              Export
            </Button>
            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Import
              <input type="file" onChange={handleImport} className="hidden" accept="application/json" />
            </label>
          </div>
        </div>

        <SaleTable
          sales={paginatedSales}
          onDelete={handleDeleteSale}
          onEdit={handleEditClick}
          onSort={handleSort}
          sortConfig={sortConfig}
          onBulkDelete={handleBulkDelete}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="self-center">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
