// src/components/dashboard/KpiCard.jsx
import React from "react";
import clsx from "clsx";

const KpiCard = ({ title, value, icon, color = "gray" }) => {
  const textColor = clsx({
    "text-gray-800 dark:text-white": color === "gray",
    "text-green-600 dark:text-green-400": color === "green",
    "text-red-600 dark:text-red-400": color === "red",
    "text-yellow-600 dark:text-yellow-400": color === "yellow",
    "text-blue-600 dark:text-blue-400": color === "blue",
    // Add more color mappings as needed
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className={`text-3xl ml-4 ${textColor}`}>
        {icon}
      </div>
    </div>
  );
};

export default KpiCard;
