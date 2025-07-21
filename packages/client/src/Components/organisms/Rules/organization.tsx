import { Badge, Blockquote, Field, Fieldset, Heading, HStack, Mark, Separator, Stack, Text, Wrap } from "@chakra-ui/react";
import SimpleLink from "@scspace-client/Components/atoms/SimpleLink";

export default function OrgRule() {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>
                <Heading>
                    Organization Rules
                </Heading>
            </Fieldset.Legend>
            <Fieldset.HelperText>
                조직 관련 세칙 및 안내사항
            </Fieldset.HelperText>
            <Fieldset.Content>
                <Field.Root>
                    <Field.Label>
                        조직(Organization)이란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    조직은 한명의 Delegator를 필두로, 여러명의 Member로 구성된 그룹입니다. 조직원은 같은 예약을 공유할 수 있으며, 모든 Member에게 예약 관리 권한이 부여됩니다.
                                </Text>
                                <Text>
                                    조직 생성은 <SimpleLink href="/mypage/organization" text="Mypage > 조직 관리" /> 혹은 사이드바의 <SimpleLink href="/mypage/organization" text="조직 > 내 조직" /> 에서 가능합니다. (둘은 동일한 페이지입니다.)
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        위임자(Delegator)란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    위임자는 조직의 관리자로, 조직의 모든 예약 및 다른 멤버 관리할 수 있는 권한을 가집니다.
                                </Text>
                                <Text>
                                    위임자는 조직 생성 시 자동으로 조직을 생성한 사람으로 지정되며, 이후 다른 Member를 위임자로 지정할 수 있습니다.
                                </Text>
                                <Text>
                                    위임자는 조직의 이름을 관리할 수 있습니다.
                                </Text>
                                <Text>
                                    위임자는 조직의 멤버를 관리할 수 있으며, 학번을 통해 멤버를 추가하거나, 멤버를 삭제할 수 있습니다
                                </Text>
                                <Text>
                                    위임자는 조직의 상태 변경과 관련된 내용을 메일로 전달받습니다
                                </Text>
                                <Text>
                                    위임자는 조직의 예약을 관리할 수 있으며, 예약 신청, 수정, 취소 권한을 가집니다.
                                </Text>
                                <Text color={"gray"}>
                                    위임자는 조직 예약 신청 시, 예약 승인 내역을 메일로 전달받습니다. (추가 예정)
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        멤버(Member)란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    멤버는 조직의 구성원으로, 위임자가 지정할 수 있습니다.
                                </Text>
                                <Text>
                                    멤버는 조직의 다른 멤버를 관리할 수는 없습니다.
                                </Text>
                                <Text>
                                    멤버는 조직의 예약을 관리할 수 있으며, 예약 신청, 수정, 취소 권한을 가집니다.
                                </Text>
                                <Text color={"gray"}>
                                    멤버는 조직 예약 신청 시, 예약 승인 내역을 메일로 전달받습니다. (추가 예정)
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        상태(Status)란?
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    조직의 상태는 조직의 현재 상태를 나타냅니다. 조직은 다음과 같은 상태를 가질 수 있습니다:
                                </Text>
                                <Wrap justify={"center"} border={"1px solid"} borderColor={"gray.200"} p={2} rounded={"sm"}>
                                    <Badge colorPalette={"black"} variant={"solid"}>
                                        반려됨 (Rejected)
                                    </Badge>
                                    <Badge colorPalette={"green"}>
                                        등록 신청 (Registeration Requested)
                                    </Badge>
                                    <Badge colorPalette={"green"} variant={"solid"}>
                                        등록됨 (Registered)
                                    </Badge>
                                    <Badge colorPalette={"blue"}>
                                        인증 신청 (Verification Requested)
                                    </Badge>
                                    <Badge colorPalette={"blue"} variant={"solid"}>
                                        인증됨 (Verified)
                                    </Badge>
                                </Wrap>
                                <Text>
                                    처음 조직을 생성하면, 조직은 <Badge colorPalette={"green"}>등록 신청 (Registeration Requested)</Badge> 상태가 됩니다.
                                </Text>
                                <Text>
                                    이후, 공간위 내부 회의를 통해 조직은 <Badge colorPalette={"green"} variant={"solid"}>등록됨 (Registered)</Badge> 혹은 <Badge colorPalette={"black"} variant={"solid"}>반려됨 (Rejected)</Badge> 상태로 변경됩니다.
                                </Text>
                                <Text color={"red"} fontWeight={"semibold"}>
                                    조직의 이름이 조직의 존재 의의를 명확히 나타내지 않거나, 조직의 목적이 명확하지 않은 경우 반려될 수 있습니다.
                                </Text>
                                <Text>
                                    등록된 조직은 위임자가 인증 신청을 할 수 있으며, 이 경우 <Badge colorPalette={"blue"}>인증 신청 (Verification Requested)</Badge> 상태가 됩니다.
                                </Text>
                                <Text>
                                    인증 신청시 공간위 내부 심사가 진행되고, 승인되면 조직은 <Badge colorPalette={"blue"} variant={"solid"}>인증됨 (Verified)</Badge> 상태가 됩니다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        인증(Verification) 관련 안내
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    인증은 학부 총학생회 산하 의결기구, 집행기구, 자치기구 및 기타 (중앙선거관리위원회, 집행조정위원회 등), 그리고 학부동아리연합회 산하 정동아리 및 가동아리의 경우, 별다른 추가 절차 없이 승인됩니다.
                                </Text>
                                <Text>
                                    위에 대한 자세한 내용은 <SimpleLink href="https://student.kaist.ac.kr/wiki/%ED%95%99%EB%B6%80_%EC%B4%9D%ED%95%99%EC%83%9D%ED%9A%8C" text="KAIPEDIA" /> 및 <SimpleLink href="https://clubs.sparcs.org/clubs" text="CLUBS KAIST" /> 에서 확인 가능합니다.
                                </Text>
                                <Text>
                                    또한 위에 언급되지 않은 단체에서 인증을 받고자 하는 경우, <Mark variant={"text"} fontWeight={"semibold"} color={"blue"}>인증 신청을 한 뒤</Mark> 공간위에 메일로 문의하여 인증 신청을 할 수 있습니다.
                                </Text>
                                <Separator />
                                <Text>
                                    인증된 조직만 공연집중기간 추첨 및 세미나실 정기예약 추첨에 참여할 수 있습니다.
                                </Text>
                                <Text>
                                    이를 위해 인증된 조직은 조직 관리에서 단체실 소유 여부를 설정하여야 합니다.
                                </Text>
                                <Text color={"red"} fontWeight={"semibold"}>
                                    세미나실 정기예약 추첨에서 우위를 점하기 위해 단체실 소유 여부를 사실과 다르게 설정한 경우, 예약 강제 삭제 및 일정 기간 조직의 인증이 취소될 수 있습니다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
            </Fieldset.Content>
        </Fieldset.Root>
    );
}