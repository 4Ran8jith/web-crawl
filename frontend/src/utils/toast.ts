import { toast } from "react-hot-toast";
import client from "./client";
import { showError } from "../utils/toast";

export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
};

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err?.response?.data?.error || "Unexpected error occurred";
    showError(message);
    return Promise.reject(err);
  }
);
