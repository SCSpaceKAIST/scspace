import { useQueryApi } from "./api";

export function usePasspinAPI() {
    const passpin = (spaceId: number) => {
        useQueryApi(`/passpin/${spaceId}`);
    }

    return { passpin };
}
