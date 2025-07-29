import { Badge, HStack, Text } from "@chakra-ui/react";
import { useUserAPI } from "@scspace-client/Hooks/user";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { IUser } from "@scspace-depot/types/user/user.type";

export default function UserName({ user }: { user: IUser }) {
    const { getUserTypeCode } = useUserAPI({ uid: user.id });

    const color = {
        [UserTypeEnum.WORKER]: "green",
        [UserTypeEnum.MANAGER]: "orange",
        [UserTypeEnum.ADMIN]: "blue",
    }

    return (
        <HStack m={0} p={0} alignContent="center" alignItems="center" gap={1} maxW={"full"}>
            <Text truncate maxW={"full"}>
                {user.nameKr}
            </Text>
            {user.type !== UserTypeEnum.USER && (
                <Badge colorPalette={color[user.type]} variant="outline">
                    {getUserTypeCode(user.type)}
                </Badge>
            )}
        </HStack>
    );
}
