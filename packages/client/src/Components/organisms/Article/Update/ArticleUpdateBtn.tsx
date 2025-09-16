import { Badge } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

export default function ArticleUpdateBtn({ editable, setEditable, handleUpdate }: {
    editable: boolean;
    setEditable: Dispatch<SetStateAction<boolean>>;
    handleUpdate: () => void;
}) {
    return (
        <Badge
            colorPalette="green"
            variant={{
                base: "subtle",
                _hover: "solid"
            }}
            cursor={"pointer"}
            onClick={() => {
                if (editable) {
                    handleUpdate();
                } else {
                    setEditable(true);
                }
            }}
        >
            {editable ? "Save" : "Update"}
        </Badge>
    );
}