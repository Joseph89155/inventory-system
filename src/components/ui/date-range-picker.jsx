// src/components/ui/date-range-picker.jsx
const DateRangePicker = ({ from, to, onChange }) => (
  <div className="flex gap-2">
    <input type="date" value={from} onChange={(e) => onChange("from", e.target.value)} className="p-2 border rounded" />
    <span>to</span>
    <input type="date" value={to} onChange={(e) => onChange("to", e.target.value)} className="p-2 border rounded" />
  </div>
);

export default DateRangePicker;
