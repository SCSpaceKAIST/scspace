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
    links: [
        {
            href: "/browse",
            label: "찾아보기",
            helperText: "Browse",
            subdomains: [
                {
                    href: "/browse/archive",
                    label: "자료실",
                    helperText: "Archive",
                },
                {
                    href: "/browse/space",
                    label: "공간",
                    helperText: "Spaces",
                    subdomains: [],
                },
                {
                    href: '/browse/rules',
                    label: "세칙",
                    helperText: "Rules"
                }
            ]
        },
        {
            href: "/article",
            label: "게시판",
            helperText: "Article",
        },
        {
            href: "/organization",
            label: "조직",
            helperText: "Organization",
            subdomains: [
                {
                    href: "/organization/verified",
                    label: "인증된 조직",
                    helperText: "Verified Organization"
                },
            ]
        },
        {
            href: "/reservation",
            label: "예약",
            helperText: "Reservation",
            subdomains: [
                {
                    href: "/reservation/status",
                    label: "현황",
                    helperText: "Status",
                    subdomains: [],
                },
            ]
        },
        {
            href: "/rental",
            label: "대여",
            helperText: "Rental",
            subdomains: [
                {
                    href: "/rental/application",
                    label: "대여 품목",
                    helperText: "Goods List",
                },
            ]
        },
    ],
    update: (links) => set(() => ({ links })),
}));

