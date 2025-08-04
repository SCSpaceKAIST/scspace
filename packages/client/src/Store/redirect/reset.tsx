"use client";

import { useAllSpace } from "@scspace-client/Hooks/space";
import { useEffect, useState } from "react";
import { IRedirect, useRedirectStore } from ".";
import { useAuth } from "@scspace-client/Hooks/auth";

export function useRedirects() {
    const { spaces } = useAllSpace();
    const [spaceLinks, setSpaceLinks] = useState<IRedirect[]>([]);
    const [calendarLinks, setCalendarLinks] = useState<IRedirect[]>([]);
    const { userInfo, isAdmin, isManager, isLogined } = useAuth();

    useEffect(() => {
        if (spaces) setSpaceLinks(spaces.map((s): IRedirect => {
            return {
                href: `/browse/space/${s.id}`,
                helperText: s.nameEn,
                label: s.nameKr,
            }
        }))
    }, [spaces]);

    useEffect(() => {
        if (spaces) setCalendarLinks(
            spaces.map((s): IRedirect => ({
                href: `/reservation/status/${s.id}`,
                helperText: s.nameEn,
                label: s.nameKr,
            }))
        )
    }, [spaces]);

    const { update } = useRedirectStore();

    useEffect(() => {
        update([
            {
                href: "/browse",
                label: "찾아보기",
                helperText: "Browse",
                subdomains: [
                    {
                        href: '/browse/scspace',
                        label: "공간위",
                        helperText: "SCSpace"
                    },
                    {
                        href: "/browse/space",
                        label: "공간",
                        helperText: "Spaces",
                        subdomains: spaceLinks,
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
                disabled: true
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
                    {
                        href: "/mypage/organization",
                        label: "내 조직",
                        helperText: "My Organization",
                        invisible: !isLogined,
                    },
                ]
            },
            {
                href: "/reservation",
                label: "예약",
                helperText: "Reservation",
                subdomains: [
                    {
                        href: "/reservation/application",
                        label: "신청",
                        helperText: "Application",
                        invisible: !isLogined,
                    },
                    {
                        href: "/reservation/status",
                        label: "현황",
                        helperText: "Status",
                        subdomains: calendarLinks
                    },
                    {
                        href: "/mypage/reservation",
                        label: "내 예약",
                        helperText: "My Reservation",
                        invisible: !isLogined,
                    }
                ]
            },
            {
                href: "/rental",
                label: "대여",
                helperText: "Rental",
                disabled: true
            },
            {
                href: "/manage",
                label: "관리",
                helperText: "Management",
                invisible: !isManager,
                subdomains: [
                    {
                        href: "/manage/organization",
                        label: "조직",
                        helperText: "Organization"
                    },
                    {
                        href: "/manage/reservation",
                        label: "예약",
                        helperText: "Reservation"
                    }
                ]
            },
            {
                href: "/admin",
                label: "운영",
                helperText: "Administration",
                invisible: !isAdmin,
                subdomains: [
                    {
                        href: "/admin/user",
                        label: "유저 관리",
                        helperText: "Manage User"
                    },
                    {
                        href: "/manage/rules",
                        label: "세칙",
                        helperText: "Rules"
                    }
                ]
            },
            {
                href: "/dev",
                label: "개발",
                helperText: "Development",
                invisible: !isAdmin,
            }
        ]);
    }, [spaceLinks, isLogined, isAdmin, userInfo]);
}