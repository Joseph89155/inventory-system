const Select = ({ options = [], value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`border px-3 py-2 rounded w-full focus:outline-none focus:ring ${className}`}
  >
    {options.map((opt, idx) => (
      <option key={idx} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default Select;
