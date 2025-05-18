import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ For navigation
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct) => {
    const datedProduct = { ...newProduct, dateAdded: new Date().toISOString() };
    setProducts((prev) => [...prev, datedProduct]);
  };

  const handleDeleteProduct = (indexToDelete) => {
    setProducts((prev) => prev.filter((_, i) => i !== indexToDelete));
    if (editingIndex === indexToDelete) {
      setEditingIndex(null);
      setEditingProduct(null);
    }
  };

  const handleBulkDelete = (indexes) => {
    setProducts((prev) => prev.filter((_, i) => !indexes.includes(i)));
  };

  const handleEditClick = (index, product) => {
    setEditingIndex(index);
    setEditingProduct(product);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((prod, i) => (i === editingIndex ? updatedProduct : prod))
    );
    setEditingIndex(null);
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingProduct(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_export.json";
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
          const updated = imported.map((p) => ({
            ...p,
            dateAdded: p.dateAdded || new Date().toISOString(),
            id: p.id || Date.now() + Math.random(),
          }));
          setProducts((prev) => [...prev, ...updated]);
        }
      } catch (error) {
        alert("Failed to import: Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts];
  if (sortConfig.key) {
    sortedProducts.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
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
      <h1 className="text-4xl font-bold mb-6 text-center">
        Inventory Management
      </h1>

      {/* 🔗 Navigation Links to Other Pages */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ← Back to Dashboard
        </Link>
        <Link to="/sales" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          View Sales
        </Link>
        <Link to="/reports" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Generate Reports
        </Link>
      </div>

      <ProductForm
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onCancelEdit={handleCancelEdit}
        editingProduct={editingProduct}
        isEditing={editingIndex !== null}
      />

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full sm:w-1/2 p-2 rounded border border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Export
            </button>
            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Import
              <input type="file" onChange={handleImport} className="hidden" accept="application/json" />
            </label>
          </div>
        </div>

        <ProductTable
          products={paginatedProducts}
          onDelete={handleDeleteProduct}
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

export default Inventory;
