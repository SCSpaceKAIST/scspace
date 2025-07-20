import { SegmentGroup } from "@chakra-ui/react";

export default function hasRoom({ hasRoom, refetch }: {
    refetch?: () => void;
    hasRoom?: boolean;
}) {
    return (
        <SegmentGroup.Root value={hasRoom ? "1" : "0"}>
            <SegmentGroup.Indicator />
            <SegmentGroup.Item value="1">
                <SegmentGroup.ItemText>
                    Yes
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
            <SegmentGroup.Item value="0">
                <SegmentGroup.ItemText>
                    No
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
        </SegmentGroup.Root>
    )
}