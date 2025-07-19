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

    if (uid !== did) {
        return (
            <Text color="gray">
                Only for Delegator
            </Text>
        );
    }

    if (mid === uid) {
        return (
            <Text color="gray">
                Cannot manage yourself
            </Text>
        );
    }

    return ((uid === did) ? (
        <HStack>
            <AlertBtn
                onClick={() => updateOrg({
                    delegatorId: mid,
                }, {
                    onSuccess: () => {
                        alert("Delegator updated successfully.");
                        refetch();
                    }
                })}
                colorPalette="blue"
                buttonText="Delegator"
                dialogTitle="Are you sure?"
            >
                <Text>
                    Are you sure you want to make this member a delegator?
                </Text>
                <Text>
                    This action cannot be undone, and the member will have full control over the organization.
                </Text>
            </AlertBtn>
            <DeleteBtn
                onDelete={() => deleteMember({
                    userId: mid
                }, {
                    onSuccess: () => {
                        alert("Member deleted successfully.");
                        refetch();
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