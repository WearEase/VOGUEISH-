"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
}

const DATA_SET: Record<string, DataPoint[]> = {
  "1W": [
    { label: "Mon", value: 12500 },
    { label: "Tue", value: 19800 },
    { label: "Wed", value: 15400 },
    { label: "Thu", value: 24500 },
    { label: "Fri", value: 22100 },
    { label: "Sat", value: 31200 },
    { label: "Sun", value: 28900 },
  ],
  "1M": [
    { label: "Week 1", value: 85000 },
    { label: "Week 2", value: 105000 },
    { label: "Week 3", value: 98000 },
    { label: "Week 4", value: 132000 },
  ],
  "6M": [
    { label: "Jan", value: 320000 },
    { label: "Feb", value: 280000 },
    { label: "Mar", value: 390000 },
    { label: "Apr", value: 430000 },
    { label: "May", value: 410000 },
    { label: "Jun", value: 480000 },
  ],
  "1Y": [
    { label: "Jul", value: 250000 },
    { label: "Aug", value: 290000 },
    { label: "Sep", value: 310000 },
    { label: "Oct", value: 360000 },
    { label: "Nov", value: 420000 },
    { label: "Dec", value: 490000 },
    { label: "Jan", value: 320000 },
    { label: "Feb", value: 280000 },
    { label: "Mar", value: 390000 },
    { label: "Apr", value: 430000 },
    { label: "May", value: 410000 },
    { label: "Jun", value: 480000 },
  ],
};

export default function SalesChart() {
  const [activePeriod, setActivePeriod] = useState<"1W" | "1M" | "6M" | "1Y">("6M");
  const data = useMemo(() => DATA_SET[activePeriod], [activePeriod]);

  // Chart dimensions
  const width = 600;
  const height = 300;
  const paddingX = 40;
  const paddingY = 30;

  // Tooltip & interactive states
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Compute scale boundaries
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value)) * 1.1, [data]);
  const minVal = useMemo(() => Math.min(...data.map((d) => d.value)) * 0.9, [data]);
  const diffVal = maxVal - minVal || 1;

  // Generate SVG coordinates for each point
  const points = useMemo(() => {
    return data.map((d, index) => {
      const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((d.value - minVal) / diffVal) * (height - paddingY * 2);
      return { x, y, label: d.label, value: d.value };
    });
  }, [data, minVal, diffVal]);

  // Compute SVG Line path and Area path
  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Smooth bezier curves
      const prev = points[i - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 3;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (2 * (p.x - prev.x)) / 3;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
  }, [points, linePath]);

  // Format currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Handle hover interactions
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    
    // Find closest point by x coordinate
    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const activePoint = points[closestIdx];
    // Map coordinate back to client client rect for HTML Tooltip
    const clientX = rect.left + (activePoint.x / width) * rect.width - window.scrollX;
    const clientY = rect.top + (activePoint.y / height) * rect.height - window.scrollY;

    setHoverIndex(closestIdx);
    setTooltipPos({ x: clientX, y: clientY });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="w-full relative bg-white dark:bg-zinc-900/40 p-4 rounded-xl">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-md font-semibold text-gray-500 dark:text-gray-400">Sales Trends</h4>
          <p className="text-2xl font-bold font-sans text-gray-900 dark:text-white mt-1">
            {formatINR(data.reduce((acc, cur) => acc + cur.value, 0))}
            <span className="text-xs font-normal text-gray-400 dark:text-zinc-500 ml-2">Total Period Volume</span>
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-lg">
          {(["1W", "1M", "6M", "1Y"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activePeriod === period
                  ? "bg-white dark:bg-zinc-700 text-purple-700 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Plot */}
      <div className="relative overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            const valueLabel = maxVal - ratio * diffVal;
            return (
              <g key={idx} className="opacity-40 dark:opacity-20">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="9"
                  className="fill-gray-400 font-sans"
                >
                  {formatINR(valueLabel).replace("₹", "K ").slice(0, -3)}
                </text>
              </g>
            );
          })}

          {/* Area under the curve */}
          <motion.path
            d={areaPath}
            fill="url(#chart-area-grad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Bezier line curve */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#A855F7"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Bottom X Labels */}
          {points.map((p, idx) => {
            // Render label periodically if there are too many (e.g. 1Y)
            if (activePeriod === "1Y" && idx % 2 !== 0) return null;
            return (
              <text
                key={idx}
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                className="fill-gray-400 dark:fill-zinc-500 font-medium font-sans"
              >
                {p.label}
              </text>
            );
          })}

          {/* Interactive Guides and Highlight Node */}
          {hoverIndex !== null && points[hoverIndex] && (
            <g>
              {/* Vertical Guide */}
              <line
                x1={points[hoverIndex].x}
                y1={paddingY}
                x2={points[hoverIndex].x}
                y2={height - paddingY}
                stroke="#D8B4FE"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Glow Dot */}
              <circle
                cx={points[hoverIndex].x}
                cy={points[hoverIndex].y}
                r="8"
                className="fill-purple-300 opacity-60 animate-pulse"
              />
              {/* Center Dot */}
              <circle
                cx={points[hoverIndex].x}
                cy={points[hoverIndex].y}
                r="5"
                className="fill-purple-600 stroke-white stroke-2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Floating Tooltip Div */}
      {hoverIndex !== null && points[hoverIndex] && (
        <div
          className="fixed bg-gray-900/95 dark:bg-zinc-800/95 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 pointer-events-none z-[100] border border-gray-700/50 backdrop-blur-sm transition-all duration-75"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y - 45}px`,
          }}
        >
          <div className="font-semibold text-gray-400">{points[hoverIndex].label}</div>
          <div className="text-sm font-bold text-purple-300">
            {formatINR(points[hoverIndex].value)}
          </div>
        </div>
      )}
    </div>
  );
}
