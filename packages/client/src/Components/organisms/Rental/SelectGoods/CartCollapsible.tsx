import { Button, Card, Collapsible, Separator, Stack, StackSeparator } from "@chakra-ui/react";
import { ICartItem } from "../List";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";

export default function CartCollapsible({ cart, setCart }: {
    cart: ICartItem[];
    setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>;
}) {
    return (
        <Collapsible.Root>
            <Stack separator={<StackSeparator />}>
                <Collapsible.Content pt={2}>
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
                <Collapsible.Trigger asChild>
                    <Button width={"full"} variant={"outline"}>
                        {cart.at(0) ? `In Cart: ${cart.length}` : "Cart is empty"}
                    </Button>
                </Collapsible.Trigger>
            </Stack>
        </Collapsible.Root>
    );
}
