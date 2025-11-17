import React, {useState} from "react";
export default function AdminReports() {
  const [timeframe, setTimeframe] = useState("monthly");

  const dataSets = {
    daily: [
      { name: "Mon", newUsers: 5, siteVisits: 120 },
      { name: "Tue", newUsers: 8, siteVisits: 150 },
      { name: "Wed", newUsers: 6, siteVisits: 130 },
      { name: "Thu", newUsers: 10, siteVisits: 180 },
      { name: "Fri", newUsers: 7, siteVisits: 160 },
      { name: "Sat", newUsers: 12, siteVisits: 220 },
      { name: "Sun", newUsers: 4, siteVisits: 100 },
    ],
    monthly: [
      { name: "August", newUsers: 85, siteVisits: 1350 },
      { name: "September", newUsers: 95, siteVisits: 1500 },
      { name: "October", newUsers: 120, siteVisits: 1750 },
      { name: "November", newUsers: 140, siteVisits: 2000 },
    ],
    yearly: [
      { name: "2022", newUsers: 600, siteVisits: 12000 },
      { name: "2023", newUsers: 900, siteVisits: 15000 },
      { name: "2024", newUsers: 1100, siteVisits: 18000 },
      { name: "2025", newUsers: 1400, siteVisits: 22000 },
    ],
  };

  const [activities] = useState([
    { id: 1, action: "User John Doe visited the website", date: "2025-10-28" },
    { id: 2, action: "New category 'Philosophy' added", date: "2025-10-27" },
    { id: 3, action: "User Jane Smith registered", date: "2025-10-25" },
  ]);

  const renderTable = (data) => (
    <table className="w-full border border-[#EAD7BE] mt-4 text-[#5D4E37]">
      <thead className="bg-[#EAD7BE] text-left">
        <tr>
          <th className="p-2">Period</th>
          <th className="p-2">New Users</th>
          <th className="p-2">Website Visits</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t border-[#EAD7BE]">
            <td className="p-2">{row.name}</td>
            <td className="p-2">{row.newUsers}</td>
            <td className="p-2">{row.siteVisits}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 bg-[#F5E6D3] min-h-screen rounded-xl">
      <h1 className="text-3xl font-bold text-[#5D4E37] mb-6">Reports & Analytics</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#5D4E37]">Website Traffic & User Statistics</h2>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border rounded p-2 text-[#5D4E37]"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        {renderTable(dataSets[timeframe])}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-[#5D4E37] mb-4">Recent Activities</h2>
        <ul className="divide-y divide-[#EAD7BE]">
          {activities.map((activity) => (
            <li key={activity.id} className="py-2">
              <p className="text-[#5D4E37]">{activity.action}</p>
              <span className="text-sm text-gray-500">{activity.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
