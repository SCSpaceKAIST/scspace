import { IUser } from "@scspace-depot/types/user";
import axios, { AxiosResponse } from "axios";
import { sendPost } from "./useApi";

// async function sendPost(): Promise<AxiosResponse<IUser | null>> {
  
  
//   const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/verification`;
//   console.log(url);
//   const config = {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   return await axios.post<IUser | null>(url, JSON.stringify({}), config);
// }

export default async function LoginCheck(): Promise<IUser | null> {
  const res = await sendPost<IUser|null>("/auth/verification", {});
  console.log("res", res);
  
  return res;
}
