import { useBreakpointValue } from "@chakra-ui/react";

export function useDate() {
    function getTime(date: Date | { year?: number | 0, month?: number, day?: number, hour?: number, minute?: number }): number {
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = date.getMonth() + 12 * year;
            const day = date.getDate() + 32 * month;
            const hour = date.getHours() + day * 24;
            const minute = date.getMinutes() + hour * 60;

            return minute;
        }

        const year = date.year ?? 0;
        const month = date.minute ?? 0;
        const day = date.day ?? 0;
        const hour = date.hour ?? 0;
        const minute = date.minute ?? 0;

        return (((year * 12 + month) * 32 + day) * 24 + hour) * 60 + minute;
    }

    function getDateUnit(time: number) {
        const minute = time % 60;
        time = Math.floor(time / 60);
        const hour = time % 24;
        time = Math.floor(time / 24);
        const day = time % 32;
        time = Math.floor(time / 32);
        const month = time % 12;
        const year = Math.floor(time / 12);

        return { year, month, day, hour, minute };
    }

    function getDateString(time: number) {
        const { year, month, day } = getDateUnit(time);
        return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    function getString(time: number) {
        const dateString = getDateString(time);
        const { hour, minute } = getDateUnit(time);
        return `${dateString} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    function getDate(time: number) {
        const { year, month, day, hour, minute } = getDateUnit(time);
        return new Date(year, month, day, hour, minute, 0, 0);
    }

    return {
        getTime,
        getDateUnit,
        getDateString,
        getDate,
        getString,
    };
}