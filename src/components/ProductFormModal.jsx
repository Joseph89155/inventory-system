import { useEffect } from "react";

const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  isEditing,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newProduct = {
      name: form.name.value,
      category: form.category.value,
      quantity: parseInt(form.quantity.value),
      price: parseFloat(form.price.value),
      id: editingProduct?.id || Date.now(),
      dateAdded: editingProduct?.dateAdded || new Date().toISOString(),
    };
    onSubmit(newProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isEditing ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            defaultValue={editingProduct?.name || ""}
            placeholder="Name"
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            name="category"
            defaultValue={editingProduct?.category || ""}
            placeholder="Category"
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="number"
            name="quantity"
            defaultValue={editingProduct?.quantity || ""}
            placeholder="Quantity"
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={editingProduct?.price || ""}
            placeholder="Price"
            required
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
