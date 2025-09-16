import { Badge, HStack, Spacer } from "@chakra-ui/react";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { ArticleTypeEnum } from "@scspace-depot/enums/article.enum";

export default function ArticleTypeUpdate({ type, setType }: {
    type: ArticleTypeEnum;
    setType: (type: ArticleTypeEnum) => void;
}) {
    return (
        <HStack>
            <Spacer />
            {Object.entries(ArticleTypeString).map(([key, value]) => (
                <Badge
                    key={key}
                    onClick={() => setType(parseInt(key) as ArticleTypeEnum)}
                    colorPalette={type === parseInt(key) ? "blue" : "gray"}
                >
                    {value}
                </Badge>
            ))}
            <Spacer />
        </HStack>
    );
}