import { Accordion, Badge, Blockquote, Button, List, Stack } from "@chakra-ui/react";

export default function SeminarLotteryNotice() {
    const notice: {
        [key: string]: {
            content: React.ReactNode | string;
            color?: string;
        }[]
    } = {
        eng: [
            { content: "You can select a time slot to apply for the seminar lottery.", },
            { content: "The number in each column represents the number of organizations that applied during that time.", },
            {
                content: (
                    <>
                        Organization names are represented by <Badge colorPalette={'blue'}>Org has Room</Badge> or <Badge colorPalette={'green'}>Org has no Room</Badge>, depending on whether the organization has a group room.
                    </>
                )
            },
            {
                content: "Organizations without group rooms have priority in the lottery.",
                color: "blue"
            },
            { content: "The lottery will be automatically conducted every day at 6 PM during the lottery period, and the results will be notified via email." },
            { content: "The winning time slot displays the name of the winning organization, and you can select an organization to highlight only that organization's time slot." },
            {
                content: "You can delete and reapply after winning the lottery, but you CANNOT revert to winning status after deleting.",
                color: "red"
            },
            {
                content: "Some time slots may already be booked for Humanity/Leadership classes or other reasons, in which case the time slot win will not apply.",
                color: "red"
            }
        ],
        kor: [
            { content: "세미나 추첨을 신청할 시간대를 선택할 수 있습니다.", },
            { content: "각 열의 숫자는 해당 시간에 신청한 조직의 수를 나타냅니다.", },
            {
                content: (
                    <>
                        조직의 이름은 단체실 소유 여부에 따라 <Badge colorPalette={'blue'}>Org has room</Badge> 또는 <Badge colorPalette={'green'}>Org has no room</Badge>으로 표시됩니다.
                    </>
                )
            },
            {
                content: "단체실이 없는 조직이 추첨에서 우선권을 가집니다.",
                color: "blue"
            },
            { content: "추첨은 추첨 기간중 매일 오후 6시에 자동으로 진행되며, 결과는 이메일로 통지됩니다." },
            { content: "당첨된 시간대에는 당첨된 조직의 이름이 표시되며, 조직을 선택하면 해당 조직의 시간대만 강조 표시됩니다." },
            {
                content: "당첨된 후에는 삭제 및 재신청이 가능하지만, 삭제 후에는 당첨 상태로 되돌릴 수 없습니다.",
                color: "red"
            },
            {
                content: "인성/리더쉽 수업이나 기타 이유로 이미 예약이 들어가 있는 시간대도 있으며, 이 경우 해당 시간대에 당첨되더라도 반영되지 않으니 유의 바랍니다.",
                color: "red"
            }
        ]
    }

    return (
        <Accordion.Root collapsible multiple asChild>
            <Stack>
                {Object.keys(notice).map((lang) => (
                    <Accordion.Item key={lang} value={lang}>
                        <Accordion.ItemTrigger asChild>
                            <Button variant={"subtle"} width={"full"}>
                                Notice ({lang})
                            </Button>
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent rounded={"none"}>
                            <Blockquote.Root variant={"solid"}>
                                <Blockquote.Content>
                                    <List.Root listStyle={"none"}>
                                        {notice[lang].map((item, index) => (
                                            <List.Item key={index} fontWeight={item.color ? "semibold" : undefined} color={item.color}>
                                                {item.content}
                                            </List.Item>
                                        ))}
                                    </List.Root>
                                </Blockquote.Content>
                            </Blockquote.Root>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Stack>
        </Accordion.Root>
    );
}
