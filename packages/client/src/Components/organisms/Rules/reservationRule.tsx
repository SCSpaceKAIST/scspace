import { Blockquote, Field, Fieldset, Heading, Stack, Text } from "@chakra-ui/react";

export default function ResRule() {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>
                <Heading>
                    Reservation Rules
                </Heading>
            </Fieldset.Legend>
            <Fieldset.HelperText>
                곧 자세하게 업데이트 될 예정입니다.
            </Fieldset.HelperText>
            <Fieldset.Content>
                <Stack>
                    <Text>
                        예약은 공간의 종류에 따라 다르게 운영됩니다. 아래의 규칙을 참고하여 예약해 주세요.
                    </Text>
                    <Text color="blue" fontWeight={"semibold"}>
                        아래 규칙에 대한 예외의 예약이 필요한 경우, 메일로 문의해 주세요.
                    </Text>
                </Stack>
                <Field.Root>
                    <Field.Label>
                        개인연습실, 피아노실
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    예약은 사용일의 14일 전 00시00분부터 1일 전 23시59분까지 가능하다
                                </Text>
                                <Text>
                                    예약은 하루에 최대 2시간까지 가능하다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        세미나실
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    예약은 사용일의 14일 전 00시00분부터 2일 전 23시59분까지 가능하다
                                </Text>
                                <Text>
                                    예약은 두 세미나실을 합쳐 하루에 최대 3시간, 일주일에 최대 6시간까지 가능하다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        무예실
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    예약은 사용일의 14일 전 00시00분부터 2일 전 23시59분까지 가능하다
                                </Text>
                                <Text>
                                    개인 예약은 하루에 최대 2시간까지 가능하다.
                                </Text>
                                <Text>
                                    조직 예약은 하루에 최대 4시간까지 가능하다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        합주실
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    예약은 사용일의 14일 전 00시00분부터 2일 전 23시59분까지 가능하다
                                </Text>
                                <Text>
                                    개인 예약은 하루에 최대 2시간까지 가능하다.
                                </Text>
                                <Text>
                                    조직 예약은 하루에 최대 4시간까지 가능하다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        미래홀, 조수미홀
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    예약은 사용일의 45일 전 00시00분부터 10일 전 23시 59분까지 가능하다
                                </Text>
                                <Text>
                                    개인 예약은 하루에 최대 4시간까지 가능하다.
                                </Text>
                                <Text>
                                    조직 예약은 하루에 최대 24시간까지 가능하다.
                                </Text>
                                <Text>
                                    예약은 일주일에 최대 2일까지 가능하다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        창작공방
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    예약은 사용일의 14일 전 00시00분부터 1일 전 23시59분까지 가능하다
                                </Text>
                                <Text>
                                    개인 예약은 하루에 최대 4시간까지 가능하다.
                                </Text>
                                <Text>
                                    조직 예약은 하루에 최대 8시간까지 가능하다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
                <Field.Root>
                    <Field.Label>
                        오픈스페이스, 전시계단, 로비
                    </Field.Label>
                    <Blockquote.Root>
                        <Blockquote.Content>
                            <Stack>
                                <Text>
                                    예약은 사용일의 45일 전 00시00분부터 5일 전 23시59분까지 가능하다
                                </Text>
                                <Text>
                                    개인 예약은 하루에 최대 4시간까지 가능하다.
                                </Text>
                                <Text>
                                    조직 예약은 하루에 최대 24시간까지 가능하다.
                                </Text>
                            </Stack>
                        </Blockquote.Content>
                    </Blockquote.Root>
                </Field.Root>
            </Fieldset.Content>
        </Fieldset.Root>
    );
}