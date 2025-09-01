"use client"

import { Alert, Center, Heading } from "@chakra-ui/react";
import { useSeminarLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { useDate } from "@scspace-client/Hooks/utils";
import { useEffect } from "react";

export default function SeminarLotteryStatus() {
    const { data: activeLotteryInfo, refetch } = useSeminarLotteryInfoAPI().activeLotteryInfo;
    const { getDateString } = useDate();

    useEffect(() => {
        refetch();
    }, []);

    return (
        <Alert.Root status={(activeLotteryInfo && activeLotteryInfo.length > 0) ? "info" : "error"
        }>
            <Alert.Content alignItems={"center"}>
                {(activeLotteryInfo && activeLotteryInfo.length > 0) && (
                    <Heading>
                        {getDateString(activeLotteryInfo[0].timeLotteryStart)} To {getDateString(activeLotteryInfo[0].timeLotteryEnd)}
                    </Heading>
                )}
                <Alert.Title>
                    {(activeLotteryInfo && activeLotteryInfo.length > 0 && !activeLotteryInfo[0].applied) ? (
                        "세미나실 정기예약 추첨이 진행 중입니다."
                    ) : (
                        "세미나실 정기예약 추첨 기간이 아닙니다."
                    )}
                </Alert.Title>
                <Alert.Description>
                    {(activeLotteryInfo && activeLotteryInfo.length > 0 && !activeLotteryInfo[0].applied) ? (
                        "The Seminar-room regular reservation lottery is currently in progress."
                    ) : (
                        "The Seminar-room regular reservation lottery is NOT in progress."
                    )}
                </Alert.Description>
            </Alert.Content>
        </Alert.Root >
    );
}
