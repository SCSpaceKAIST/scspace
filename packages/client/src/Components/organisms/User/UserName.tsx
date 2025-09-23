import { Badge, HStack, Text } from "@chakra-ui/react";
import { useUserAPI } from "@scspace-client/Hooks/user";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import { IUser } from "@scspace-depot/types/user/user.type";
import { UserUtils } from "@scspace-depot/utils/user.utils";

export default function UserName({ user }: { user: IUser }) {
    const { getUserTypeCode } = useUserAPI({ uid: user.id });

    const color = (type: UserTypeEnum) => {
        if (UserUtils.isAdmin(type)) return "blue";
        if (UserUtils.isManager(type)) return "orange";
        if (UserUtils.isWorker(type)) return "green";
        return "gray";
    }

    return (
        <HStack m={0} p={0} alignContent="center" alignItems="center" gap={1} maxW={"full"}>
            <Text truncate maxW={"full"}>
                {user.nameKr}
            </Text>
            {!UserUtils.isUser(user.type) && (
                <Badge colorPalette={color(user.type)} variant="outline">
                    {getUserTypeCode(user.type)}
                </Badge>
            )}
        </HStack>
    );
}
