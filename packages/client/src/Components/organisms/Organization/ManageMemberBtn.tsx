"use client"

import { Button, HStack, Text } from "@chakra-ui/react";
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
                dialogTitle="Are you sure?"
                dialogBody={<>
                    <Text>
                        Are you sure you want to make this member a delegator?
                    </Text>
                    <Text>
                        This action cannot be undone, and the member will have full control over the organization.
                    </Text>
                </>}
            >
                <Button
                    colorPalette="blue"
                    variant={"outline"}
                    px={1}
                    py={0}
                    height="fit-content"
                >
                    Delegator
                </Button>
            </AlertBtn>
            <AlertBtn
                onClick={() => deleteMember({
                    userId: mid
                }, {
                    onSuccess: () => {
                        alert("Member deleted successfully.");
                        refetch();
                    }
                })}
                colorPalette="red"
                buttonText="Delete"
                dialogTitle="Are you sure?"
                dialogBody={<>
                    <Text>
                        Are you sure you want to delete this member?
                    </Text>
                    <Text>
                        This action cannot be undone, so if you want to add this member again, you will need to invite them again.
                    </Text>
                </>}
            >
                <Button
                    colorPalette="red"
                    variant={"outline"}
                    px={1}
                    py={0}
                    height="fit-content"
                >
                    Delete
                </Button>
            </AlertBtn>
        </HStack>
    ) : (
        <Text color="gray">
            Only for Delegator
        </Text>
    ))
}