"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:33001/api";

const valueToString = (val: unknown) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};

export const useQueryApi = <ResponseType>(
  endpoint: string,
  params?: object,
) => {
  const queryKey = [endpoint, params || {}];

  return useQuery<ResponseType>({
    queryKey,
    queryFn: async () => {
      const queryString = params
        ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([key, val]) => [
            key,
            valueToString(val),
          ]),
        ).toString()
        : "";
      const res = await fetch(`${baseUrl}${endpoint}${queryString}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  });
};

export const useMutationApi = <ResponseType, RequestParamType extends object>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" | "GET",
) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestParamType>({
    mutationFn:
      method === "GET"
        ? async (content?: RequestParamType) => {
          const queryString = content
            ? "?" +
            new URLSearchParams(
              Object.entries(content).map(([key, val]) => [
                key,
                valueToString(val),
              ]),
            ).toString()
            : "";
          const res = await fetch(`${baseUrl}${endpoint}${queryString}`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        }
        : async (content?: RequestParamType) => {
          const res = await fetch(`${baseUrl}${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(content ?? {}),
          });
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};
