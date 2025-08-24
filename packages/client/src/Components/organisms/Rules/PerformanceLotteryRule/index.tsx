import { Badge, Blockquote, Field, Fieldset, Heading, Stack, Text, Wrap } from "@chakra-ui/react";
import SimpleLink from "@scspace-client/Components/atoms/SimpleLink";
import { BlueMark, RedMark } from "../utils";
import PerformanceLotteryStatus from "./PerformanceLotteryStatus";

export default function PerformanceLotteryRule() {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>
                <Heading whiteSpace={"break-spaces"}>
                    Performance Concentration Period Lottery Rules
                </Heading>
            </Fieldset.Legend>
            <Fieldset.HelperText>
                공연집중기간 추첨 관련 세칙 및 안내사항
            </Fieldset.HelperText>
            <Fieldset.Content>
                <PerformanceLotteryStatus />
                <Field.Root>
                    <Field.Label>
                        공연집중기간이란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    1년에 3번, 1번에 4주, 공연동아리의 공연이 집중적으로 이루어지는 기간입니다.
                                </Text>
                                <Wrap justify={"center"} border={"1px solid"} borderColor={"gray.200"} p={2} rounded={"sm"}>
                                    <Badge colorPalette={"blue"}>
                                        봄학기 개강 전주~3주차(4주)
                                    </Badge>
                                    <Badge colorPalette={"blue"}>
                                        봄학기 개강 10~13주차(4주)
                                    </Badge>
                                    <Badge colorPalette={"blue"}>
                                        가을학기 개강 10~13주차(4주)
                                    </Badge>
                                </Wrap>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        공연집중기간 추첨이란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    공연집중기간 추첨에 당첨되면 해당 조직이 공연집중기간 중 <BlueMark>하루 24시간 동안</BlueMark> 미래홀이나 조수미홀을 사용할 수 있습니다.
                                </Text>
                                <Text>
                                    본 추첨은 동아리의 공연 장소 및 날짜를 확정짓는 데 도움을 주기 위한 이벤트로, 공연 전 연습을 위해 공간 예약이 필요하다면 공간위 사이트에서 추첨 후 남은 날짜를 직접 예약하시기 바랍니다.
                                </Text>
                                <Text>
                                    추첨이 모두 끝난 후 남은 날짜에 대한 예약은 공간위 홈페이지에서 진행할 수 있으며, 이는 사용할 날짜의 45일 전부터 선착순입니다.
                                </Text>
                                <Text>
                                    ※ 공연집중기간 추첨 페이지는 추첨 신청 기간에만 공간위 웹사이트에 열립니다!
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        추첨 방법
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    매 추첨 시작 전까지 새롭게 추첨 신청을 받습니다.
                                </Text>
                                <Text>
                                    추첨은 조직의 위임자만 신청할 수 있고, 신청 현황/추첨 결과는 실시간으로 모두가 볼 수 있습니다.
                                </Text>
                                <Text>
                                    추첨 신청 시 각 조직은 공연집중기간 동안의 미래홀/조수미홀 공연 희망 날짜를 3일(1~3지망) 신청할 수 있습니다.
                                </Text>
                                <Text>
                                    매일 18시에 추첨이 이루어지고, 결과는 공간위 웹사이트에서 확인 가능합니다. 당첨된다면 해당 조직의 위임자에게 메일이 발송됩니다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        우선순위의 작용방법
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    <BlueMark>1순위</BlueMark>로 신청된 날짜에 대한 추첨을 합니다.
                                </Text>
                                <Text>
                                    <BlueMark>1순위</BlueMark>에 당첨된 조직의 <RedMark>2, 3순위 신청은 삭제</RedMark>됩니다.
                                </Text>
                                <Text>
                                    <BlueMark>당첨되지 않은 날짜</BlueMark> 중 <BlueMark>2순위</BlueMark>로 신청된 날짜에 대한 추첨을 합니다.
                                </Text>
                                <Text>
                                    <BlueMark>2순위</BlueMark>에 당첨된 조직의 <RedMark>3순위 신청은 삭제</RedMark>됩니다.
                                </Text>
                                <Text>
                                    <BlueMark>당첨되지 않은 날짜</BlueMark> 중 <BlueMark>3순위</BlueMark>로 신청된 날짜에 대한 추첨을 합니다.
                                </Text>
                                <Text>
                                    당첨되지 않은 3순위 신청은 <RedMark>삭제</RedMark>됩니다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        추첨 신청 전 유의사항
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    <RedMark>인증된 조직만이 추첨에 참여할 수 있습니다.</RedMark> 조직 인증을 받는 방법은 <SimpleLink href="/browse/rules" text="찾아보기 > 세칙 > Organization" />에서 알 수 있습니다.
                                </Text>
                                <Text>
                                    <RedMark>
                                        공연집중기간으로 얻을 수 있는 예약 일수는 하루입니다.
                                    </RedMark>
                                </Text>
                                <Text>
                                    매 추첨 전, 추첨 페이지에서 날짜별 신청한 조직과 우선순위를 확인할 수 있습니다.
                                </Text>
                                <Text>
                                    매 추첨 후, 당첨된 날짜에는 당첨된 조직의 이름이 표시되며 해당 날짜에는 추첨을 신청할 수 없습니다.
                                </Text>
                                <Text>
                                    조수미홀과 미래홀은 서로 다른 공간으로, 각각 당첨여부가 결정됩니다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        추첨 당첨 후 유의사항
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    당첨된 후에는 삭제 및 재신청이 가능하지만, <RedMark>삭제 후에는 당첨 상태로 되돌릴 수 없습니다.</RedMark>
                                </Text>
                                <Text>
                                    인성/리더십 수업이나 기타 이유로 이미 예약이 들어가 있는 시간대도 있으며, 이 경우 해당 날짜에 당첨되면 <BlueMark>이미 예약이 있는 시간대를 제외하고 하루 전체가 예약됩니다.</BlueMark>
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
            </Fieldset.Content>
        </Fieldset.Root >
    );
}