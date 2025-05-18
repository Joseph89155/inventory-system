// components/ui/Checkbox.jsx
const Checkbox = ({ checked, onChange }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
    />
  );
};

export default Checkbox;
