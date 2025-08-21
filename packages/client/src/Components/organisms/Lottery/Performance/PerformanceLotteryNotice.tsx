import { Accordion, Badge, Blockquote, List } from "@chakra-ui/react";

export default function PerformanceLotteryNotice() {
    const notice: {
        [key: string]: {
            content: React.ReactNode | string;
            color?: string;
        }[]
    } = {
        eng: [
            {
                content: "You can select a date to apply for the performance lottery during the intensive period.",
            },
            {
                content: "The number in each column represents the number of organizations that applied during that date.",
            },
            {
                content: "The names of the organizations are listed in order of their application priority, with <Badge colorPalette={'purple'}>Priority 1</Badge>, <Badge colorPalette={'yellow'}>Priority 2</Badge>, or <Badge colorPalette={'green'}>Priority 3</Badge>.",
            },
            {
                content: "The lottery will be automatically conducted every day at 6 PM during the lottery period, and the results will be notified via email."
            },
            {
                content: "The winning date slot displays the name of the winning organization, and you can select an organization to highlight only that organization's date slot."
            },
            {
                content: "You can delete and reapply after winning the lottery, but you CANNOT revert to winning status after deleting.",
                color: "red"
            }
        ],
        kor: [
            { content: "공연집중기간 추첨을 신청할 날짜를 선택할 수 있습니다.", },
            { content: "각 날짜의 숫자는 해당 날짜에 1, 2, 3순위로 신청한 조직의 수를 나타냅니다.", },
            {
                content: (
                    <>
                        조직의 이름은 신청한 지망 순으로 아래로 배열되며, <Badge colorPalette={'purple'}>Priority 1</Badge>, <Badge colorPalette={'yellow'}>Priority 2</Badge>, 또는 <Badge colorPalette={'green'}>Priority 3</Badge>으로 표시됩니다.
                    </>
                )
            },
            { content: "추첨은 매일 오후 6시에 자동으로 진행되며, 결과는 이메일로 통지됩니다." },
            { content: "당첨된 날짜에는 당첨된 조직의 이름이 표시되며, 조직을 선택하면 해당 조직이 신청한 날짜만 강조 표시됩니다." },
            {
                content: "당첨된 후에는 삭제 및 재신청이 가능하지만, 삭제 후에는 당첨 상태로 되돌릴 수 없습니다.",
                color: "red"
            }
        ]
    }

    return (
        <Accordion.Root collapsible multiple>
            {Object.keys(notice).map((lang) => (
                <Accordion.Item key={lang} value={lang}>
                    <Accordion.ItemTrigger>
                        Notice ({lang})
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
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
        </Accordion.Root>
    );
}
