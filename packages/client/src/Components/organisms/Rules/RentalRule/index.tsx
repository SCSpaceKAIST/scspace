import { Badge, Blockquote, Field, Fieldset, Heading, Stack, Text } from "@chakra-ui/react";
import SimpleLink from "@scspace-client/Components/atoms/SimpleLink";
import { BlueMark, RedMark } from "../utils";

export default function RentalRule() {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>
                <Heading whiteSpace={"break-spaces"}>
                    Rental Rules
                </Heading>
            </Fieldset.Legend>
            <Fieldset.HelperText>
                대여 관련 세칙 및 안내사항
            </Fieldset.HelperText>
            <Fieldset.Content>
                <Field.Root>
                    <Field.Label>
                        대여란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    공간위에서는 대여를 위한 다양한 규칙과 절차를 마련하고 있습니다.
                                </Text>
                                <Text>
                                    의자, 책상 및 다양한 물품들을 대여할 수 있으며, 대여 가능한 물품들은 <SimpleLink href="/rental/application" text="찾아보기 > 대여" />에서 확인할 수 있습니다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        대여 규칙
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    대여는 한번에 최대 5개 까지만
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