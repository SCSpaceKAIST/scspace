'use client';

import { useCallback } from 'react';

const useApi = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const sendGet = useCallback(
    async <T>(endpoint: string, content?: object): Promise<T> => {
      const queryString =
        content && typeof content === "object"
          ? "?" +
            new URLSearchParams(
              Object.entries(content).reduce((acc, [key, value]) => {
                if (value && typeof value === 'object') {
                  acc[key] = JSON.stringify(value);
                } else {
                  acc[key] = String(value);
                }
                return acc;
              }, {} as Record<string, string>)
            ).toString()
          : "";

      const url = `${baseUrl}${endpoint}${queryString}`;

      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    }, 
    [baseUrl]
  );

  const sendPost = useCallback(async <T>(endpoint: string, content: object): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }, [baseUrl]);

  const sendPut = useCallback(async <T>(endpoint: string, content: object): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }, [baseUrl]);

  const sendDelete = useCallback(async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }, [baseUrl]);

  return { sendGet, sendPost, sendPut, sendDelete };
};

export default useApi;