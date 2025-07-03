"use client"

import { Blockquote, Box, Center, ColorPicker, DataList, Field, Fieldset, Grid, Heading, HStack, parseColor, Separator, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Scroll from "@scspace-client/Components/atoms/Scroll";

export default function Scspace() {
  const colors: string[] = [
    "#7F7262",
    "#7B9EB6",
    "#221F19",
    "#D4DADD"
  ]

  return (
    <Scroll>
      <Fieldset.Root fontSize="sm">
        <Fieldset.Legend>
          <Heading>
            Introducing SCSpace
          </Heading>
        </Fieldset.Legend>
        <Fieldset.Content>
          <Field.Root>
            <Field.Label>
              학생문화공간위원회
            </Field.Label>
            <Blockquote.Root>
              <Blockquote.Content>
                <Stack>
                  <Text>
                    KAIST 학생문화공간위원회(이하 공간위)는 장영신학생회관을 비롯한 KAIST 교내 학생 문화공간의 총체적인 관리 및 운영을 담당하고 진정한 학생 공간을 위하여 공간에 대한 학생의 권리 보장과 학생 문화 발전에 기여하기 위하여 설립된 KAIST 학부 총학생회 산하 상설위원회입니다.
                  </Text>
                  <Text>
                    쉽게 말하자면, 공간위는 KAIST 학우들을 위한 학생들의 다양한 문화활동을 지원할 수 있는 공간을 관리하고 기획하는 역할을 하고 있습니다. 이를 위해, 장영신학생회관 건립 전부터 준비위원회로서 학생들의 의견을 수렴하고 반영해 왔으며 앞으로도 KAIST 학우 모두가 함께 문화를 만들어 갈 수 있도록 언제나 학우들의 이야기에 귀를 기울이고 있습니다. 저희와 같이 학생문화를 가꾸어나가고 싶다면 부담 갖지 마시고 이야기를 공유해주세요.
                  </Text>
                  <Text>
                    우리 함께 장영신학생회관에서 카이스트만의 문화를 만들어봐요!
                  </Text>
                </Stack>
              </Blockquote.Content>
            </Blockquote.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>
              팀 소개
            </Field.Label>
            <Blockquote.Root>
              <Blockquote.Content>
                <DataList.Root variant="bold">
                  <DataList.Item>
                    <DataList.ItemLabel>
                      회계팀
                    </DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Stack gap={0}>
                        <Text>
                          회계, 신학관 내부 재물 관리, 리크루팅 등
                        </Text>
                        <Text>
                          회계를 비롯해 대학우 사업 운영, 상근 관리, 자료 정리, 리크루팅 등 단체 운영에 필요한 일들을 담당하고 있습니다. 또한 공간위 내 다양한 친목 사업도 기획합니다.
                        </Text>
                      </Stack>
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>
                      디자인팀
                    </DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Stack gap={0}>
                        <Text>
                          디자인, 홍보 포스터 제작
                        </Text>
                        <Text>
                          디자인과 홍보에 관련된 업무를 담당합니다. 구체적으로는 신학관 내 공간 디자인, 단체 의류 디자인과 구매, 포스터 제작, 인스타그램 페이지 컨텐츠 제작 등을 맡고 있습니다.
                        </Text>
                      </Stack>
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>
                      관리팀
                    </DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Stack gap={0}>
                        <Text>
                          공간위 산하 관리공간(장영신학생회관 및 미래홀) 관리
                        </Text>
                        <Text>
                          울림홀, 미래홀, 합주실 등 장영신 학생회관 내외의 예약과 관리를 담당합니다. 상시 예약 제도를 운영하고, 이용자가 몰리는 공연 집중 기간에는 추첨을 진행하여 모두가 공평하게 학생회관을 이용할 수 있도록 노력하고 있습니다.
                        </Text>
                      </Stack>
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>
                      개발팀
                    </DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Stack gap={0}>
                        <Text>
                          홈페이지 제작 및 내부 전산화
                        </Text>
                        <Text>
                          예약 시스템을 만들고 운영합니다. 기계가 잘 하는 일을 기계에게 맡겨서, 다른 사람들이 더 의미있는 일에 집중할 수 있게 합니다.
                        </Text>
                      </Stack>
                    </DataList.ItemValue>
                  </DataList.Item>
                </DataList.Root>
              </Blockquote.Content>
            </Blockquote.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label>
              CI 소개
            </Field.Label>
            <Blockquote.Root>
              <Blockquote.Content>
                <Stack>
                  <Text>
                    학생문화공간위원회 CI는 학생, 문화, 그리고 공간의 세 가치를 담았습니다.
                  </Text>
                  <Grid templateColumns="1fr 1fr" width="fit-content" gap={4}>
                    <Box position="relative" height="100%">
                      <Image
                        fill
                        style={{ objectFit: "contain" }}
                        src="/img/logo.svg"
                        alt="Logo"
                      />
                    </Box>
                    <Center>
                      <Stack>
                        {colors.map((c) => (
                          <ColorPicker.Root defaultValue={parseColor(c)} key={c} readOnly>
                            <ColorPicker.Control>
                              <ColorPicker.ValueSwatch boxSize={5} />
                              <ColorPicker.ValueText />
                            </ColorPicker.Control>
                          </ColorPicker.Root>
                        ))}
                      </Stack>
                    </Center>
                  </Grid>
                  <Text>
                    학생, 문화, 그리고 공간. 저희 단체가 항상 노력하는 세 가지를 각각 푸르른 청춘, 붉은 장영신학생회관, 그리고 깨끗한 푸른빛 백색에 담아 제작하였습니다.
                  </Text>
                  <Text>
                    장영신학생회관을 형상화한 로고에서 하이라이트된 ㄱㄱㅇ 모양은 해당 장소와 같이 성장해온 저희 단체의 이야기를 말해줍니다.
                  </Text>
                </Stack>
              </Blockquote.Content>
            </Blockquote.Root>
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
    </Scroll>
  );
};