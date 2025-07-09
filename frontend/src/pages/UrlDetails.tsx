import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUrlDetails, reanalyzeUrl } from "../api/urls";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4ade80", "#60a5fa"];

export default function UrlDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["urlDetails", id],
    queryFn: () => getUrlDetails(Number(id)),
  });

  const reanalyzeMutation = useMutation({
    mutationFn: () => reanalyzeUrl(Number(id)),
    onSuccess: () => queryClient.invalidateQueries(["urlDetails", id]),
  });

  if (isLoading) return <p>Loading details...</p>;
  if (error) return <p>Error loading details.</p>;

  const chartData = [
    { name: "Internal Links", value: data.internalLinks },
    { name: "External Links", value: data.externalLinks },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
      <p className="mb-4">HTML Version: {data.htmlVersion}</p>

      {/* Chart */}
      <h2 className="text-xl font-semibold mb-2">Link Breakdown</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Broken Links */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Broken Links</h2>
      {data.brokenLinks.length === 0 ? (
        <p>No broken links detected 🎉</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">URL</th>
              <th className="p-2 text-left">Status Code</th>
            </tr>
          </thead>
          <tbody>
            {data.brokenLinks.map((link: any, idx: number) => (
              <tr key={idx}>
                <td className="p-2">{link.url}</td>
                <td className="p-2">{link.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Re-analyze Button */}
      <button
        onClick={() => reanalyzeMutation.mutate()}
        disabled={reanalyzeMutation.isLoading}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {reanalyzeMutation.isLoading ? "Re-analyzing..." : "Re-analyze"}
      </button>
    </div>
  );
}
