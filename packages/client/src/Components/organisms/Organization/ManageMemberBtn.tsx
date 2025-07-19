"use client"

import { HStack, Text } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";

export default function ManageMemberBtn({ uid, oid, did, mid, refetch }: {
    did: number;
    uid: number;
    oid: number;
    mid: number;
    refetch: () => any;
}) {
    const { member, updateOrg } = useOrganizationAPI({ id: oid });
    const deleteMember = member.deleteMember;

    return ((uid === did) ? (
        <HStack>
            <AlertBtn
                onClick={() => updateOrg({
                    delegatorId: mid,
                }, {
                    onSuccess: () => {
                        alert("Member updated successfully.");
                        refetch();
                    }
                })}
                colorPalette="blue"
                buttonText="Delegator"
                dialogTitle="Confirm"
            >
            </AlertBtn>
            <DeleteBtn
                onDelete={() => deleteMember({
                    userId: mid
                }, {
                    onSuccess: () => {
                        alert("Member deleted successfully.");
                    }
                })}
            />
        </HStack>
    ) : (
        <Text color="gray">
            Only for Delegator
        </Text>
    ))
}