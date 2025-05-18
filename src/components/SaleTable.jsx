// SaleTable.jsx
import { useState } from "react";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import  Button  from "../components/ui/button";
import  Checkbox  from "../components/ui/checkbox";

const SaleTable = ({
  sales,
  onDelete,
  onEdit,
  onSort,
  sortConfig,
  onBulkDelete,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(sales.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isSorted = (key) => sortConfig.key === key;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-md">
        <thead>
  <tr className="border-b">
    <th className="p-2">
      <Checkbox
        checked={selectedRows.length === sales.length && sales.length > 0}
        onCheckedChange={handleSelectAll}
      />
    </th>
    {[{ key: "product", label: "Product" },
      { key: "quantity", label: "Quantity" },
      { key: "price", label: "Price" },
      { key: "date", label: "Date" }].map(({ key, label }) => (
      <th
        key={key}
        className="text-left p-2 cursor-pointer select-none"
        onClick={() => onSort(key)}
      >
        <div className="flex items-center gap-1">
          {label}
          {isSorted(key) && (
            <ArrowUpDown
              size={16}
              className={sortConfig.direction === "asc" ? "rotate-180" : ""}
            />
          )}
        </div>
      </th>
    ))}
    <th className="p-2 text-left">Actions</th>
  </tr>
</thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr
              key={sale.id}
              className="border-b hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="p-2">
                <Checkbox
                  checked={selectedRows.includes(index)}
                  onCheckedChange={() => handleSelectRow(index)}
                />
              </td>
              <td className="p-2">{sale.product}</td>
              <td className="p-2">{sale.quantity}</td>
              <td className="p-2">${sale.price}</td>
              <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(index, sale)}>
                  <Edit size={16} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(index)}>
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRows.length > 0 && (
        <div className="mt-2 text-right">
          <Button variant="destructive" onClick={() => onBulkDelete(selectedRows)}>
            Delete Selected ({selectedRows.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default SaleTable;
