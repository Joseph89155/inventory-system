// SaleFormModal.jsx
import { useState, useEffect } from "react";
import Dialog from "../components/ui/dialog";
import  Input  from "../components/ui/input";
import  Label  from "../components/ui/label";
import  Button  from "../components/ui/button";

const SaleFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    price: "",
    date: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ product: "", quantity: "", price: "", date: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Sale" : "Add Sale"}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div>
          <Label>Product</Label>
          <Input
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Quantity</Label>
          <Input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Date</Label>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">{initialData ? "Update" : "Add"} Sale</Button>
        </div>
      </form>
    </Dialog>
  );
};

export default SaleFormModal;
