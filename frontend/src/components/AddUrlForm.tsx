import { useState } from "react";
import client from "../api/client";
import { useUrls } from "../hooks/useUrls";

const AddUrlForm = () => {
  const [url, setUrl] = useState("");
  const { refetch } = useUrls();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await client.post("/urls", { link: url });
    setUrl("");
    refetch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="url"
        placeholder="Enter website URL"
        className="border p-2 rounded w-full"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="bg-blue-600 text-white p-2 rounded">Add</button>
    </form>
  );
};

export default AddUrlForm;
