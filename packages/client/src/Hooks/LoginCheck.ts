import axios, { AxiosResponse } from "axios";
import { LckResType } from "@depot/types/auth";

async function sendPost(): Promise<AxiosResponse<LckResType>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/verification`;
  console.log(url);
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await axios.post<LckResType>(url, JSON.stringify({}), config);
}

export default async function LoginCheck(): Promise<LckResType> {
  const res = await sendPost();
  const body = res.data;
  return body;
}
