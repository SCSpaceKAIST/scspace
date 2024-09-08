// 제네릭 타입을 가진 sendGet 함수
export const sendGet = async <T extends unknown>(
  endpoint: string
): Promise<T> => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: "GET",
      credentials: "include", // 쿠키 포함 옵션
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // JSON 응답을 T 타입으로 변환합니다
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // 에러를 호출자에게 전파합니다.
  }
};

export const sendPost = async <T extends unknown>(
  endpoint: string,
  content: Object
): Promise<T> => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json(); // JSON 파싱을 하지 않고 response 객체 반환
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const sendPut = async <T extends unknown>(
  endpoint: string,
  content: Object
): Promise<T> => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const sendDelete = async <T extends unknown>(
  endpoint: string
): Promise<T> => {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method: "DELETE",
      credentials: "include",
    });
    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
