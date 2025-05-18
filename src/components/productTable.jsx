import { useState, useMemo } from "react";

const ProductTable = ({ products, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredProducts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredProducts.map((_, i) => i));
    }
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const diff = (new Date(expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [products, searchTerm, sortField, sortOrder]);

  if (filteredProducts.length === 0) {
    return (
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded w-full sm:w-1/2"
        />
        <p className="text-gray-500 text-center">No products found.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full sm:w-1/2"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filteredProducts.length}
                  onChange={handleSelectAll}
                  title="Select all"
                />
              </th>
              {[ 
                { label: "Name", field: "name" },
                { label: "Category", field: "category" },
                { label: "Quantity", field: "quantity" },
                { label: "Price", field: "price" },
                { label: "Date Added", field: "dateAdded" },
                { label: "Expiration", field: "expirationDate" },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  className="p-4 cursor-pointer hover:underline"
                  onClick={() => handleSort(field)}
                  title={`Sort by ${label}`}
                >
                  {label} {sortField === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${
                  product.quantity <= 10 ? "bg-red-100" : ""
                } ${isExpiringSoon(product.expirationDate) ? "text-orange-700" : ""}`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleSelectRow(index)}
                    title="Select row"
                  />
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category || "—"}</td>
                <td className="p-4">{product.quantity}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.dateAdded || "—"}</td>
                <td className="p-4">{product.expirationDate || "—"}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => onEdit(index, product)}
                    className="text-blue-600 hover:underline"
                    title="Edit Product"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:underline"
                    title="Delete Product"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedRows.length > 0 && (
          <div className="p-4 bg-gray-50 border-t text-sm text-gray-600">
            {selectedRows.length} selected — bulk actions coming soon
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
