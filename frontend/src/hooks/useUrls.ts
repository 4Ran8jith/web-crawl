import { useQuery } from "@tanstack/react-query";
import client from "../api/client";

export const useUrls = () => {
  return useQuery(["urls"], async () => {
    const res = await client.get("/urls");
    return res.data;
  });
};
