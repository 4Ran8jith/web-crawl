import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUrl } from "../api/urls";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUrl,
    onSuccess: () => {
      queryClient.invalidateQueries(["urls"]); // refresh table
      setUrl("");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to add URL");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.startsWith("http")) {
      alert("Please enter a valid URL");
      return;
    }
    mutation.mutate(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="border rounded px-3 py-2 flex-1"
      />
      <button
        type="submit"
        disabled={mutation.isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {mutation.isLoading ? "Adding..." : "Add URL"}
      </button>
    </form>
  );
}
