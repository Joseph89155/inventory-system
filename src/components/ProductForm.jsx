import { useEffect, useState } from "react";

const ProductForm = ({
  onAddProduct,
  onUpdateProduct,
  onCancelEdit,
  editingProduct,
  isEditing,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    dateAdded: "",
    expirationDate: "",
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState({ names: [], categories: [] });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    const names = [...new Set(stored.map((p) => p.name))];
    const categories = [...new Set(stored.map((p) => p.category))];
    setSuggestions({ names, categories });
  }, []);

  useEffect(() => {
    if (isEditing && editingProduct) {
      setFormData({
        ...editingProduct,
        dateAdded: editingProduct.dateAdded || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        quantity: "",
        price: "",
        dateAdded: "",
        expirationDate: "",
      });
    }
  }, [editingProduct, isEditing]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required.";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Quantity must be positive.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be positive.";
    if (!formData.expirationDate)
      newErrors.expirationDate = "Expiration date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newProduct = {
      ...formData,
      dateAdded: formData.dateAdded || new Date().toISOString().split("T")[0],
      id: isEditing ? editingProduct.id : Date.now(),
    };

    if (isEditing) {
      onUpdateProduct(newProduct);
    } else {
      onAddProduct(newProduct);
    }

    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      dateAdded: "",
      expirationDate: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      dateAdded: "",
      expirationDate: "",
    });
    setErrors({});
    onCancelEdit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            list="product-names"
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="product-names">
            {suggestions.names.map((n, i) => (
              <option key={i} value={n} />
            ))}
          </datalist>
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            list="categories"
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="categories">
            {suggestions.categories.map((c, i) => (
              <option key={i} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        <div>
          <input
            type="date"
            name="dateAdded"
            placeholder="Date Added"
            value={formData.dateAdded}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="date"
            name="expirationDate"
            placeholder="Expiration Date"
            value={formData.expirationDate}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.expirationDate && (
            <p className="text-red-500 text-sm">{errors.expirationDate}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
