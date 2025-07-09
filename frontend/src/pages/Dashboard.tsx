import { useState } from "react";
import UrlForm from "../components/UrlForm";
import DashboardTable from "../components/DashboardTable";



const Dashboard = () => {
  const dummyData = [
    { id: 1, title: "Example", htmlVersion: "HTML5", internalLinks: 10 },
    { id: 2, title: "Another", htmlVersion: "HTML4", internalLinks: 5 },
  ];

  const [data, setData] = useState(dummyData);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <table className="table-auto w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">HTML Version</th>
            <th className="px-4 py-2">Internal Links</th>
          </tr>
        </thead>
        <tbody>
          {data.map((url) => (
            <tr key={url.id} className="border-t">
              <td className="px-4 py-2">{url.title}</td>
              <td className="px-4 py-2">{url.htmlVersion}</td>
              <td className="px-4 py-2">{url.internalLinks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;


export default function Dashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <UrlForm />
      {/* TODO: Add DashboardTable component here */}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <UrlForm />
      <DashboardTable />
    </div>
  );
}
