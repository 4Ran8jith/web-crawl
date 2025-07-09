import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Automatically add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// POST /urls to enqueue a crawl
export const addUrl = async (url: string) => {
  const res = await api.post("/urls", { url });
  return res.data;
};

// POST /urls/:id/reanalyze
export const reanalyzeUrl = async (id: number) => {
  const res = await api.post(`/urls/${id}/reanalyze`);
  return res.data;
};

// POST /urls/:id/stop
export const stopUrl = async (id: number) => {
  const res = await api.post(`/urls/${id}/stop`);
  return res.data;
};

type UrlParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
};

export const getUrls = async (params: UrlParams = {}) => {
  const res = await api.get("/urls", { params });
  return res.data;
};

export const getUrlDetails = async (id: number) => {
  const res = await api.get(`/urls/${id}`);
  return res.data;
};

export const deleteUrls = async (ids: number[]) => {
  return api.delete("/urls", { data: { ids } });
};

export const bulkReanalyze = async (ids: number[]) => {
  return api.post("/urls/reanalyze", { ids });
};
