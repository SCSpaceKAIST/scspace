import { Card, Collapsible, Stack } from "@chakra-ui/react";
import { ICartItem } from "../List";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";

export default function CartCollapsible({ cart, setCart }: {
    cart: ICartItem[];
    setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>;
}) {
    return (
        <Collapsible.Root
            open={cart.length > 0}
            height={"18dvh"}
            backgroundColor={"gray.50"}
        >
            <Collapsible.Content>
                <Scroll>
                    <Stack>
                        {cart.map(item => (
                            <Card.Root key={item.id} size={"sm"}>
                                <Card.Body>
                                    {item.name}
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </Stack>
                </Scroll>
            </Collapsible.Content>
        </Collapsible.Root>
    );
}
