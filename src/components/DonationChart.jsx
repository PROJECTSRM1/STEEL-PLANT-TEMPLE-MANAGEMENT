import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", amount: 12000 },
  { day: "Tue", amount: 8000 },
  { day: "Wed", amount: 15000 },
  { day: "Thu", amount: 10000 },
  { day: "Fri", amount: 18000 },
  { day: "Sat", amount: 22000 },
  { day: "Sun", amount: 32000 }
];

export default function DonationChart() {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#ffd27a" />
          <Tooltip />
          <Area type="monotone" dataKey="amount" stroke="#c68b22" fill="#ffd27a33" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
