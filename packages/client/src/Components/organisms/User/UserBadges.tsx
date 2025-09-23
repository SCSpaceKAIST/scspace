import { Badge, HStack, Text, Wrap } from "@chakra-ui/react";
import { UserUtils } from "@scspace-depot/utils/user.utils";

export default function UserBadges({ type }: { type: number }) {

    const color = (type: number) => {
        if (UserUtils.isAdmin(type)) return "blue";
        if (UserUtils.isManager(type)) return "orange";
        return "gray";
    }

    const text = (type: number) => {
        if (UserUtils.isAdmin(type)) return "임원진/개발국";
        if (UserUtils.isManager(type)) return "공간위원";
        return "일반";
    }

    return (
        <Wrap>
            <Badge colorPalette={color(type)} variant="outline">
                {text(type)}
            </Badge>
            {UserUtils.isWorker(type) && (
                <Badge colorPalette="green" variant="outline">
                    근로자
                </Badge>
            )}
            {UserUtils.isPasspinMaster(type) && (
                <Badge colorPalette="blue" variant="outline">
                    비밀번호 관리자
                </Badge>
            )}
        </Wrap>
    );
}
