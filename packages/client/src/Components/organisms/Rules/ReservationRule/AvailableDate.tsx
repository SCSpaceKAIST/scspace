import { Card, Center } from "@chakra-ui/react";
import { useDate } from "@scspace-client/Hooks/utils";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";
import { reservationMinDate, reservationMaxDate } from "@scspace-depot/consts/reservation.const";

export default function AvailableDate({ spaceType }: { spaceType: SpaceTypeEnum }) {
    const { getDateString, getTime } = useDate();
    const startDate = new Date();
    const endDate = new Date();

    startDate.setDate(startDate.getDate() + reservationMinDate[spaceType]);
    endDate.setDate(endDate.getDate() + reservationMaxDate[spaceType]);

    return (
        <Card.Root border={"1px solid"} borderColor={"gray.200"} size={"sm"} bg={"inherit"}>
            <Card.Header>
                <Card.Description>
                    예약 가능 날짜
                </Card.Description>
            </Card.Header>
            <Card.Body>
                <Center>
                    <Card.Title>
                        {getDateString(getTime(startDate))} To {getDateString(getTime(endDate))}
                    </Card.Title>
                </Center>
            </Card.Body>
        </Card.Root>
    );
}