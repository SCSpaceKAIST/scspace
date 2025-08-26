import { Button, ButtonGroup, Card, Drawer, Flex, NumberInput, Separator, Stack, StackSeparator } from "@chakra-ui/react";
import { ICartItem } from "../List";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import Counter from "./Counter";

export default function CartDrawer({ cart, setCart }: {
    cart: ICartItem[];
    setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>;
}) {
    return (
        <Drawer.Root size={"sm"}>
            <Drawer.Backdrop />
            <Drawer.Trigger asChild>
                <Button
                    width={"full"}
                    variant={"outline"}
                    disabled={cart.length === 0}
                >
                    {cart.at(0) ? `In Cart: ${cart.length}` : "Cart is empty"}
                </Button>
            </Drawer.Trigger>
            <Drawer.Positioner>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>
                            Cart
                        </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                        <Stack>
                            {cart.map(item => (
                                <Card.Root key={item.id} size={"sm"}>
                                    <Card.Body>
                                        <Flex justify={"space-between"} align={"center"}>
                                            <Card.Title>
                                                {item.name}
                                            </Card.Title>
                                            <Counter
                                                value={item.count}
                                                setValue={(value) => {
                                                    setCart((prev) => {
                                                        const index = prev.findIndex((i) => i.id === item.id);
                                                        if (index === -1) return prev;
                                                        const updated = [...prev];
                                                        updated[index] = { ...updated[index], count: value };
                                                        return updated;
                                                    });
                                                }}
                                            />
                                        </Flex>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </Stack>
                    </Drawer.Body>
                    <Drawer.Footer>
                        {/* <Drawer.ActionTrigger asChild>
                                <Button variant={"outline"}>
                                    Clear Cart
                                </Button>
                            </Drawer.ActionTrigger> */}
                        <Drawer.ActionTrigger asChild>
                            <Button
                                colorPalette={"red"}
                                variant={"outline"}
                                onClick={() => setCart([])}
                            >
                                Clear Cart
                            </Button>
                        </Drawer.ActionTrigger>
                        <Drawer.ActionTrigger asChild>
                            <Button
                                colorPalette={"blue"}
                            >
                                Confirm
                            </Button>
                        </Drawer.ActionTrigger>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    );
}
