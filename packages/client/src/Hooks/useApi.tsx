// 제네릭 타입을 가진 sendGet 함수
export const sendGet = async <T extends unknown>(
  endpoint: string,
  content?: Object // content는 일반 객체로 받음
): Promise<T> => {
  // content가 객체인지 확인 후 query parameter로 변환
  const queryString =
    content && typeof content === "object"
      ? "?" +
        new URLSearchParams(
          Object.entries(content).reduce(
            (acc, [key, value]) => {
              if (value instanceof Date) {
                // Date 객체를 ISO 8601 형식으로 변환
                acc[key] = (value as Date).toISOString();
              } else {
                acc[key] = String(value); // 숫자나 불리언 값을 문자열로 변환
              }
              return acc;
            },
            {} as Record<string, string>
          )
        ).toString()
      : "";

  // 최종 URL은 endpoint와 query string을 결합한 것
  const url = `/api${endpoint}${queryString}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 포함 옵션
    });

    if (!response.ok) {
      throw new Error(
        `GET request to ${url} failed with status ${response.status}`
      );
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
