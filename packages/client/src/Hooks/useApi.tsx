export const sendGet = async (endpoint: string): Promise<Response> => {
  const response = await fetch(`/api${endpoint}`, {
    method: "GET",
    credentials: "include", // 쿠키 포함 옵션
  });
  return response; // JSON 파싱을 하지 않고 response 객체 반환
};

export const sendPost = async (
  endpoint: string,
  content: Object
): Promise<Response> => {
  const response = await fetch(`/api${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
    credentials: "include",
  });
  return response; // JSON 파싱을 하지 않고 response 객체 반환
};

export const sendPut = async (
  endpoint: string,
  content: Object
): Promise<Response> => {
  const response = await fetch(`/api${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
    credentials: "include",
  });
  return response; // JSON 파싱을 하지 않고 response 객체 반환
};

export const sendDelete = async (endpoint: string): Promise<Response> => {
  const response = await fetch(`/api${endpoint}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response; // JSON 파싱을 하지 않고 response 객체 반환
};
