import { Badge } from "@chakra-ui/react";

export default function ArticleUpdateBtn({ onClick }: {
    onClick: () => void;
}) {
    return (
        <Badge
            colorPalette="green"
            variant={{ base: "subtle", _hover: "solid" }}
            cursor={"pointer"}
            onClick={onClick}
        >
            Update
        </Badge>
    );
}