// atoms/DeleteBtn.tsx

import { Button, Text } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";

export default function DeleteBtn({ onDelete }: {
    onDelete: () => any
}) {

    return (
        <AlertBtn
            onClick={onDelete}
            colorPalette="red"
            buttonText="Delete"
            dialogTitle="Are you sure?"
            dialogBody={
                <>
                    <Text>
                        This action is permanent and cannot be undone,
                    </Text>
                    <Text>
                        and the data will be completely removed from our systems.
                    </Text>
                </>
            }
        >
            <Button colorPalette="red">
                Delete
            </Button>
        </AlertBtn>
    );
}