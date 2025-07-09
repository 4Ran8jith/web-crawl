import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reanalyzeUrl, stopUrl } from "../api/urls";
import { useQuery } from "@tanstack/react-query";
import { getUrls } from "../api/urls";
import UrlRow from "./UrlRow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


type UrlRowProps = {
  id: number;
  title: string;
  status: "queued" | "running" | "done" | "error";
};

export default function UrlRow({ id, title, status }: UrlRowProps) {
  const queryClient = useQueryClient();

  const reanalyzeMutation = useMutation({
    mutationFn: () => reanalyzeUrl(id),
    onSuccess: () => queryClient.invalidateQueries(["urls"]),
  });

  const stopMutation = useMutation({
    mutationFn: () => stopUrl(id),
    onSuccess: () => queryClient.invalidateQueries(["urls"]),
  });

  return (
    <tr>
      <td>{title}</td>
      <td>{status}</td>
      <td className="flex gap-2">
        {status === "running" ? (
          <button
            onClick={() => stopMutation.mutate()}
            disabled={stopMutation.isLoading}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {stopMutation.isLoading ? "Stopping..." : "Stop"}
          </button>
        ) : (
          <button
            onClick={() => reanalyzeMutation.mutate()}
            disabled={reanalyzeMutation.isLoading}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {reanalyzeMutation.isLoading ? "Starting..." : "Start"}
          </button>
        )}
      </td>
    </tr>
  );
}

export default function DashboardTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["urls"],
    queryFn: getUrls,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Title</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((url: any) => (
          <UrlRow key={url.id} id={url.id} title={url.title} status={url.status} />
        ))}
      </tbody>
    </table>
  );
}



export default function DashboardTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["urls", page, sortBy, order, search],
    queryFn: () =>
      getUrls({ page, pageSize, sortBy, order, search }),
    keepPreviousData: true,
    refetchInterval: 5000, // Poll every 5s for realtime updates
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {/* Search */}
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Search..."
          className="border px-2 py-1 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            {["Title", "HTML Version", "Internal Links", "External Links", "Status"].map((col) => (
              <th
                key={col}
                className="cursor-pointer px-2 py-1"
                onClick={() => handleSort(col.replace(/\s+/g, '').toLowerCase())}
              >
                {col} {sortBy === col ? (order === "asc" ? "↑" : "↓") : ""}
              </th>
            ))}
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((url: any) => (
            <UrlRow
              key={url.id}
              id={url.id}
              title={url.title}
              htmlVersion={url.htmlVersion}
              internalLinks={url.internalLinks}
              externalLinks={url.externalLinks}
              status={url.status}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={data.data.length < pageSize}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}


const navigate = useNavigate();

<tr
  key={url.id}
  className="cursor-pointer hover:bg-gray-100"
  onClick={() => navigate(`/urls/${url.id}`)}
>
  <td>{url.title}</td>
  <td>{url.htmlVersion}</td>
  <td>{url.internalLinks}</td>
  <td>{url.externalLinks}</td>
  <td>{url.status}</td>
</tr>





import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUrls, bulkReanalyze } from "../api/urls";

export default function DashboardTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUrls,
    onSuccess: () => {
      queryClient.invalidateQueries(["urls"]);
      setSelectedIds([]);
    },
  });

  const reanalyzeMutation = useMutation({
    mutationFn: bulkReanalyze,
    onSuccess: () => {
      queryClient.invalidateQueries(["urls"]);
    },
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = (ids: number[]) => {
    setSelectedIds((prev) =>
      prev.length === ids.length ? [] : ids
    );
  };

  return (
    <div>
      {/* Bulk Actions */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => reanalyzeMutation.mutate(selectedIds)}
          disabled={selectedIds.length === 0 || reanalyzeMutation.isLoading}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {reanalyzeMutation.isLoading ? "Re-analyzing..." : "Re-analyze Selected"}
        </button>
        <button
          onClick={() => deleteMutation.mutate(selectedIds)}
          disabled={selectedIds.length === 0 || deleteMutation.isLoading}
          className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
        >
          {deleteMutation.isLoading ? "Deleting..." : "Delete Selected"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">
              <input
                type="checkbox"
                onChange={() => selectAll(data.data.map((u: any) => u.id))}
                checked={selectedIds.length === data.data.length}
              />
            </th>
            {["Title", "HTML Version", "Internal Links", "External Links", "Status"].map((col) => (
              <th
                key={col}
                className="cursor-pointer px-2 py-1"
                onClick={() => handleSort(col.replace(/\s+/g, '').toLowerCase())}
              >
                {col} {sortBy === col ? (order === "asc" ? "↑" : "↓") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((url: any) => (
            <tr key={url.id} className="hover:bg-gray-50">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(url.id)}
                  onChange={() => toggleSelect(url.id)}
                />
              </td>
              <td
                className="cursor-pointer"
                onClick={() => navigate(`/urls/${url.id}`)}
              >
                {url.title}
              </td>
              <td>{url.htmlVersion}</td>
              <td>{url.internalLinks}</td>
              <td>{url.externalLinks}</td>
              <td>
              <span
                  className={`px-2 py-1 rounded text-white ${
                  url.status === "queued" ? "bg-yellow-500" :
                  url.status === "running" ? "bg-blue-500" :
                  url.status === "done" ? "bg-green-500" :
                  "bg-red-500"
                  }`}
              >
                  {url.status}
              </span>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
