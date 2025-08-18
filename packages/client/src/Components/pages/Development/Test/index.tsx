"use client"

import { Badge, Blockquote, List } from "@chakra-ui/react";
import { useState } from "react";

export default function TestPage() {
    const [lang, setLang] = useState<"kor" | "eng">("kor");

    const notice: Record<"kor" | "eng", { content: string; color?: string }[]> = {
        kor: [
            {
                content: "등록하는 조직에 대한 설명을 기재하여 주시길 바랍니다."
            },
            {
                content: "조직이 총학생회 산하 자치단체일 경우, [학부 총학생회 산하 학생문화공간위원회의 공식 조직입니다] 등으로 적으시면 됩니다.",
            },
            {
                content: "조직이 동아리 연합회 소속 동아리일 경우, [학부 동아리 연합회 소속 동아리 'The Mixer'의 공식 조직입니다] 등으로 적으시면 됩니다."
            },
            {
                content: "공식 자치단체 또는 동아리도 설명을 제대로 적지 않을 경우 반려될 수 있습니다.",
                color: "blue"
            },
            {
                content: "이외 단체의 경우는 조직에 대한 설명을 기재하여야 하며, 조직의 소속 및 활동과 관련된 간단한 내용을 포함하여야 합니다.",
            },
            {
                content: "공식 자치단체 또는 동아리가 아닌 조직은 설명이 부족할 경우 반려될 수 있으며, 이 경우 이메일로 문의하시길 바랍니다.",
                color: "red"
            }
        ],
        eng: [
            {
                content: "Please provide a description of the organization you are registering."
            },
            {
                content: "If the organization is a club affiliated with the KAIST club union, you can describe it as [This is the official organization of 'The Mixer', a club affiliated with the KAIST Club Union]."
            },
            {
                content: "Even official clubs may be rejected if the description is not written properly.",
                color: "blue"
            },
            {
                content: "For other organizations, a description of the organization must be provided, including brief information about the organization's affiliation and activities."
            },
            {
                content: "Organizations that are not official clubs may be rejected if the explanation is insufficient. In this case, please contact us by email.",
                color: "red"
            }
        ]
    }

    return (
        <Blockquote.Root>
            <Blockquote.Content>
                <List.Root listStyle={"none"}>
                    {notice[lang].map((item, index) => (
                        <List.Item key={index} color={item.color ?? "black"} fontWeight={item.color ? "semibold" : "normal"}>
                            {item.content}
                        </List.Item>
                    ))}
                </List.Root>
            </Blockquote.Content>
            <Blockquote.Caption>
                <Badge onClick={() => setLang(lang === "kor" ? "eng" : "kor")} variant={{ base: "outline", _hover: "surface" }}>
                    {lang === "kor" ? "change to English" : "한국어 보기"}
                </Badge>
            </Blockquote.Caption>
        </Blockquote.Root>
    );
}
