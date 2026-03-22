import { AspectRatio, Button, Center, DataList, Heading, Link, Mark, Separator, Stack, Text } from "@chakra-ui/react";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";

export default function Archive() {
    return (
        <Scroll>
            <Stack justify={"flex-start"} maxW={"calc(100% - 4px)"} mx={"auto"}>
                <Separator />
                <Heading>
                    Forms
                </Heading>
                <DataList.Root
                    variant={"bold"}
                >
                    <DataListItem
                        label={
                            <Text>
                                <Mark>소음 발생 양해서</Mark> <Mark color="fg.muted">noise emission estimate</Mark>
                            </Text>
                        }
                    >
                        <Link
                            href="/forms/소음 발생 양해서 (noise emission estimate).pdf"
                            download
                            w={"full"}
                        >
                            <Button
                                variant="outline"
                                w={"full"}
                                colorPalette={"blue"}
                            >
                                downloads file
                            </Button>
                        </Link>
                    </DataListItem>
                </DataList.Root>
                <Separator />
                <Heading>
                    Manuals
                </Heading>
                <DataList.Root
                    variant={"bold"}
                >
                    <DataListItem
                        label={
                            <Text color={"blue"}>
                                <Mark color={"black"}>미래홀 사용 설명서</Mark> <Mark color="fg.muted">Manual for Mirae-Hall</Mark> <br />*아직 완벽하지 않아서 부족한 부분이 보일 수 있는데 그런 부분은 공유해드린 구글 독스 파일에 댓글로 남겨주시면 반영하여 수정, 추가하겠습니다!
                            </Text>
                        }
                    >
                        <Link
                            href="https://docs.google.com/document/d/1U0IpkWkp2jewem2reDkV6SIFeChtsRh6zTAquX4qm7o/edit?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            w={"full"}
                        >
                            <Button
                                variant="outline"
                                w={"full"}
                                colorPalette={"blue"}
                            >
                                open Google Docs
                            </Button>
                        </Link>
                    </DataListItem>
                    <DataListItem
                        label={
                            <Text maxW={"full"} wordBreak={"break-word"} color={"blue"}>
                                <Mark color="black">조수미홀 사용 설명서</Mark> <Mark color="fg.muted">Manual for Josumi-Hall</Mark> <br />*아직 완벽하지 않아서 부족한 부분이 보일 수 있는데 그런 부분은 공유해드린 구글 독스 파일에 댓글로 남겨주시면 반영하여 수정, 추가하겠습니다!
                            </Text>
                        }
                    >
                        <Link
                            href="https://docs.google.com/document/d/1njWD4Q3xb8IExv3W9po3KOTi32SJN1-J5gYH5bPVY48/edit?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            w={"full"}
                        >
                            <Button
                                variant="outline"
                                w={"full"}
                                colorPalette={"blue"}
                            >
                                open Google Docs
                            </Button>
                        </Link>
                    </DataListItem>
                    <DataListItem
                        label={
                            <Text>
                                <Mark>조수미홀 조명 사용법 영상</Mark> <Mark color="fg.muted">Manual Video for Josumi-Hall Lights</Mark>
                            </Text>
                        }
                    >
                        <Center w="full">
                            <AspectRatio
                                ratio={16 / 9}
                                w={{ base: "100%", md: "80%" }}
                                maxW={"7xl"}
                                borderColor={"gray"}
                                borderWidth={"1px"}
                            >
                                <iframe
                                    src="https://drive.google.com/file/d/1y1mhTdMjqncK5WKzrCLItTMQFIaDUVcL/preview"
                                    allowFullScreen
                                ></iframe>
                            </AspectRatio>
                        </Center>
                    </DataListItem>
                    <DataListItem
                        label={
                            <Text>
                                <Mark>미래홀 조명 사용법 영상</Mark> <Mark color="fg.muted">Manual Video for Mirae-Hall Lights</Mark>
                            </Text>
                        }
                    >
                        <Center w="full">
                            <AspectRatio
                                ratio={16 / 9}
                                w={{ base: "100%", md: "80%" }}
                                maxW={"7xl"}
                                borderColor={"gray"}
                                borderWidth={"1px"}
                            >
                                <iframe
                                    src="https://drive.google.com/file/d/1WR2GvwUWXG9Ow5ow4DwLON7vL89oruBe/preview"
                                    allowFullScreen
                                ></iframe>
                            </AspectRatio>
                        </Center>
                    </DataListItem>
                    <DataListItem
                        label={
                            <Text>
                                <Mark>미래홀 프로젝터/음향 사용법 영상</Mark> <Mark color="fg.muted">Manual Video for Mirae-Hall Projector/Sound</Mark>
                            </Text>
                        }
                    >
                        <Center w="full">
                            <AspectRatio
                                ratio={16 / 9}
                                w={{ base: "100%", md: "80%" }}
                                maxW={"7xl"}
                                borderColor={"gray"}
                                borderWidth={"1px"}
                            >
                                <iframe
                                    src="https://drive.google.com/file/d/1YaoLMQQC55bmgnpGIamQUjUpbrTmw49d/preview"
                                    allowFullScreen
                                ></iframe>
                            </AspectRatio>
                        </Center>
                    </DataListItem>
                </DataList.Root>
            </Stack>
        </Scroll>
    );
}
