// components/features/admin/artikel/ui/StatsCard.jsx
import React from "react";

// eslint-disable-next-line no-unused-vars
const StatsCard = ({ title, value, icon: Icon, colorVar, trend, subtitle }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in srgb, var(${colorVar}) 10%, transparent)`,
            color: `var(${colorVar})`,
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
            {trend}
          </span>
        )}
      </div>

      <div>
        <p
          className="mb-1 text-2xl font-bold"
          style={{ color: "var(--dark-text)" }}
        >
          {value}
        </p>
        <p className="mb-1 text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsCard;
