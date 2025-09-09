"use client"

import { Alert, Center, Heading } from "@chakra-ui/react";
import { usePerformanceLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { useEffect } from "react";

export default function PerformanceLotteryStatus() {
    const { data: activeLotteryInfo, refetch } = usePerformanceLotteryInfoAPI().activeLotteryInfo;
    const { getDateString } = dateUtils();

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
                        "공연집중기간 추첨이 진행 중입니다."
                    ) : (
                        "공연집중기간 추첨 기간이 아닙니다."
                    )}
                </Alert.Title>
                <Alert.Description>
                    {(activeLotteryInfo && activeLotteryInfo.length > 0 && !activeLotteryInfo[0].applied) ? (
                        "The Performance Concentration Period lottery is currently in progress."
                    ) : (
                        "The Performance Concentration Period lottery is NOT in progress."
                    )}
                </Alert.Description>
            </Alert.Content>
        </Alert.Root >
    );
}
