import { useMutationApi, useQueryApi } from "./api";
import { IPasspin, IPasspinWithSpace } from "@scspace-depot/types/passpin";

// const usePasspin = (spaceId: number) =>
//     useQueryApi<IPasspinSpace>(`/passpin/space?spaceId=${spaceId}`);

const usePasspin = () =>
    useQueryApi<IPasspinWithSpace[]>(`/passpin`);

const usePasspinHistory = (spaceId: number) =>
    useQueryApi<IPasspin[]>(`/passpin/history?spaceId=${spaceId}`);

const usePasspinAPI = () => {
    const changePasspin =
        useMutationApi<
            IPasspin,
            { spaceId: number; next?: string }
        >('/passpin', 'POST').mutateAsync;

    const deletePasspin =
        useMutationApi<
            void,
            { spaceId: number }
        >('/passpin', 'DELETE').mutateAsync;

    return {
        changePasspin,
        deletePasspin,
    }
};

export const PasspinHooks = {
    usePasspin,
    usePasspinHistory,
    usePasspinAPI,
};