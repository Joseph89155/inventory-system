import { useState } from "react";

const Switch = ({ checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div className={`w-10 h-5 bg-gray-300 rounded-full shadow-inner ${checked ? 'bg-green-500' : ''}`} />
        <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${checked ? 'translate-x-5' : ''}`} />
      </div>
    </label>
  );
};

export default Switch;
