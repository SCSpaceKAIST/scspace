"use client"

// import { IOrganization } from "@scspace-depot/types/organization";
// import { useUser } from "./user";
// import { useQueryApi } from "./useAPI";

// export function useOrganization(){
//     const getOrganizations = ({
//         uid, 
//         getAll = false
//     }: {
//         uid: number;
//         getAll: boolean;
//     }) => {
//         if (getAll) {
//             const user = useUser();
//             const userInfo = user.getUserInfo({uid: uid});
//             if (userInfo?.data?.type !== 3) return null; // Not admin

//             const orgs = useQueryApi<IOrganization[]>(`/organization/organization`);

//         }

//         const {data, isLoading, refetch} = useQueryApi<IOrganization[]>(`/organization/user/${uid}`);
//     }
// }