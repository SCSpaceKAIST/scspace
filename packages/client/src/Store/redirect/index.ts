import { create } from "zustand";

export interface IRedirect {
    href: string;
    label: string;
    helperText: string;
    subdomains?: IRedirect[];
    disabled?: boolean;
    invisible?: boolean;
}

export const useRedirectStore = create<{
    links: IRedirect[];
    update: (links: IRedirect[]) => void;
}>()((set) => ({
    links: [],
    update: (links) => set(() => ({ links })),
}));

