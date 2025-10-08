import { useMutationApi, useQueryApi } from "./api";
import { IPasspin, IPasspinSpace } from "@scspace-depot/types/passpin";

// const usePasspin = (spaceId: number) =>
//     useQueryApi<IPasspinSpace>(`/passpin/space?spaceId=${spaceId}`);

const usePasspin = () =>
    useQueryApi<IPasspin[]>(`/passpin`);

const usePasspinHistory = (spaceId: number) =>
    useQueryApi<IPasspin[]>(`/passpin/history?spaceId=${spaceId}`);

export const usePasspinAPI = () => {
    const changePasspin =
        useMutationApi<
            IPasspin,
            { spaceId: number; next?: string }
        >('/passpin', 'POST').mutateAsync;

    return {
        // usePasspin,
        usePasspin,
        usePasspinHistory,

        changePasspin,
    }
};