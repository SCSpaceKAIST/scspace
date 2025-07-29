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
        <HStack>
            <Text>
                {user.nameKr}
            </Text>
            {user.type !== UserTypeEnum.USER && (
                <Badge colorScheme={color[user.type]}>
                    {getUserTypeCode(user.type)}
                </Badge>
            )}
        </HStack>
    );
}
