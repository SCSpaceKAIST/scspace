import { CheckboxCard, Stack } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";

export default function RentalApplication() {
    return (
        <Scroll>
            <Stack p={5}>
                <CheckboxCard.Root>
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control>
                        <CheckboxCard.Content>
                            <CheckboxCard.Label>
                                신청
                            </CheckboxCard.Label>
                            <CheckboxCard.Description>
                                신청 내용을 확인하세요.
                            </CheckboxCard.Description>
                        </CheckboxCard.Content>
                        <CheckboxCard.Indicator />
                    </CheckboxCard.Control>
                    <CheckboxCard.Addon>
                        Addon
                    </CheckboxCard.Addon>
                </CheckboxCard.Root>
            </Stack>
        </Scroll>
    );
}
