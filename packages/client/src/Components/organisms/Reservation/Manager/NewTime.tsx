import { Grid, GridItem } from "@chakra-ui/react";
import { DateForm, HourForm } from "../Forms";

export default function ResTime({
    dateFrom, dateTo, setDateFrom, setDateTo, setHourFrom, setHourTo
}: {
    dateFrom: Date;
    dateTo: Date;
    setDateFrom: (date: Date) => void;
    setDateTo: (date: Date) => void;
    setHourFrom: (hour: number) => void;
    setHourTo: (hour: number) => void;
}) {
    return (
        <Grid
            templateColumns="repeat(6, 1fr)"
            gap={8}
            py={2}
        >
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <DateForm
                    label="start date"
                    date={dateFrom}
                    setDate={setDateFrom}
                />
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <DateForm
                    label="end date"
                    date={dateTo}
                    setDate={setDateTo}
                />
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <HourForm
                    label="start time"
                    setHour={setHourFrom}
                />
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 3 }}>
                <HourForm
                    label="end time"
                    setHour={setHourTo}
                />
            </GridItem>
        </Grid>
    );
}