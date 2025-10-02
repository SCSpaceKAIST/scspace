import { Button, Mark, Text } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";

export default function ConfirmBtn({ handleConfirm, count, goodsName }: {
    handleConfirm: () => void;
    count: number;
    goodsName: string;
}) {
    return (
        <AlertBtn
            onClick={handleConfirm}
            colorPalette="blue"
            buttonText="Start Rental"
            dialogTitle="Confirm Rental"
            dialogBody={(
                <>
                    <Text>
                        Are you sure you want to rent <Mark fontWeight={"semibold"} color={"blue"}>{goodsName}</Mark> (<Mark fontWeight={"semibold"} color={"blue"}>{count}</Mark> items)?
                    </Text>
                    <Text>
                        Rent will start when you click the button below.
                    </Text>
                </>
            )}
        >
            <Button size={"sm"} colorPalette={"blue"}>
                Confirm
            </Button>
        </AlertBtn>
    );
}