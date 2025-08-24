import { Badge, Blockquote, Field, Fieldset, Heading, Stack, Text } from "@chakra-ui/react";
import SimpleLink from "@scspace-client/Components/atoms/SimpleLink";
import SeminarLotteryStatus from "./SeminarLotteryStatus";
import { BlueMark, RedMark } from "../utils";

export default function SeminarLotteryRule() {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>
                <Heading whiteSpace={"break-spaces"}>
                    Seminar-room Recurring Reservation Lottery Rules
                </Heading>
            </Fieldset.Legend>
            <Fieldset.HelperText>
                세미나실 정기예약 추첨 관련 세칙 및 안내사항
            </Fieldset.HelperText>
            <Fieldset.Content>
                <SeminarLotteryStatus />
                <Field.Root>
                    <Field.Label>
                        세미나실 정기예약 추첨이란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    세미나실 정기예약은 정규학기(1주차-16주차) 중 시험기간 2주(7-8주차, 15-16주차)를 제외하고 <BlueMark>매주 특정 시간에 특정 조직에게 세미나실 예약을 정기적으로 해주는 이벤트</BlueMark>입니다.
                                </Text>
                                <Text>
                                    개강 2주 전, 일주일간 세미나실 정기예약 추첨을 받습니다.
                                </Text>
                                <Text>
                                    ※ 세미나실 정기예약 추첨 페이지는 추첨 신청 기간에만 공간위 웹사이트에 열립니다!
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
                                    매일 18시에 추첨이 이루어지고, 결과는 공간위 웹사이트에서 확인 가능합니다. 당첨된다면 해당 조직의 위임자에게 메일이 발송됩니다.
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
                                    추첨을 신청하기 전에 반드시 <SimpleLink href="/mypage/organization" text="마이페이지 > 내 조직" /> 에서 <RedMark>단체실 소유 여부</RedMark>를 지정하시길 바랍니다. 조직의 이름은 단체실 소유 여부에 따라 <Badge colorPalette={"blue"}>Org has room</Badge> 또는 <Badge colorPalette={"green"}>Org has no room</Badge>으로 표시됩니다.
                                </Text>
                                <Text>
                                    <RedMark>동아리방/회의실이 없는 조직이 우선 배정을 받습니다.</RedMark> 이를 악용하다 적발될 시 공간위가 제공하는 추첨에 불이익이 따를 수 있습니다.
                                </Text>
                                <Text>
                                    매 추첨 전, 추첨 페이지에서 시간대별 신청한 조직의 수를 확인할 수 있습니다.
                                </Text>
                                <Text>
                                    매 추첨 후, 당첨된 시간대에는 당첨된 조직의 이름이 표시되며 해당 시간대에는 추첨을 신청할 수 없습니다.
                                </Text>
                                <Text>
                                    세미나실1과 2는 서로 다른 공간으로, 각각 당첨여부가 결정됩니다.
                                </Text>
                                <Text>
                                    세미나실1과 2를 합쳐 <BlueMark>일주일 최대 6시간</BlueMark>을 신청할 수 있습니다.
                                </Text>
                                <Text>
                                    1시간 단위로 추첨을 신청할 수 있습니다.
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
                                    인성/리더십 수업이나 기타 이유로 이미 예약이 들어가 있는 시간대도 있으며, 이 경우 해당 시간대에 당첨되더라도 <BlueMark>반영되지 않습니다.</BlueMark>
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
            </Fieldset.Content>
        </Fieldset.Root >
    );
}