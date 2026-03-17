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
                                    활성화된(반납하지 않은) 대여는 한번에 최대 5개 까지만 신청할 수 있고, 반납한 뒤엔 추가로 신청할 수 있습니다.
                                </Text>
                                <Text>
                                    대여 신청 및 승인 절차는 <BlueMark>공간위원 근무 시간에만</BlueMark> 진행됩니다. 급한 경우에도 근무 시간 외 즉시 처리는 어렵습니다.
                                </Text>
                                <Text>
                                    반납 기한은 대여 시점으로부터 일주일 뒤 날짜의 23시 59분이며, <SimpleLink href="/mypage/rental" text="마이페이지 > 대여" />에서 확인한 뒤에 반납할 수 있습니다.
                                </Text>
                                <Text>
                                    반납 신청은 반드시 <BlueMark>실제로 물품을 반납한 뒤에</BlueMark> 신청하여야 하며, 이후 공간위원의 검토를 통해 반납이 완료됩니다.
                                </Text>
                                <Text>
                                    공간위원은 반납 확인 시 <Badge colorPalette={"green"}>상태</Badge>, <Badge colorPalette={"blue"}>청결</Badge>, <Badge colorPalette={"orange"}>구성품</Badge>, <Badge colorPalette={"purple"}>수량</Badge> 체크리스트를 모두 확인한 뒤 반납을 승인합니다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        대여 관련 유의사항
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    반납 기한 안에 반납하지 않을 시, <RedMark>연체 일수에 비례하여 대여 신청이 제한</RedMark>됩니다.
                                </Text>
                                <Text>
                                    연체 일수는 반납 기한으로부터 실제 반납일까지의 날짜로 계산하며, 실제 반납 일수로부터 연체 일수만큼 대여 신청이 제한됩니다.
                                </Text>
                                <Text>
                                    마이페이지의 대여 목록에서는 <Badge colorPalette={"blue"}>개인</Badge> / <Badge colorPalette={"teal"}>단체</Badge> 필터를 사용해 본인 대여를 구분해서 확인할 수 있습니다.
                                </Text>
                                <Text>
                                    <RedMark>물품 분실 혹은 손상 시 공간위가 배상을 청구할 수 있습니다.</RedMark>
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
            </Fieldset.Content>
        </Fieldset.Root >
    );
}
