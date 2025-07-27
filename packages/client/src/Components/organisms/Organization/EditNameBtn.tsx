"use client";

import { Dialog, DialogBackdrop, Button, Portal, IconButton } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import UpdateBtn from "@scspace-client/Components/molecules/buttons/UpdateBtn";
import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";

export default function EditNameBtn({ oid, refetch, name }: {
    oid: number;
    name: string;
    refetch: () => any;
}) {
    const updateOrg = useOrganizationAPI({ id: oid }).updateOrg;
    const [newName, setNewName] = useState<string>(name);

    return (
        <UpdateBtn
            tooltipContent="Edit Name"
            onUpdate={() => updateOrg({
                name: newName.trim()
            }, {
                onSuccess: () => {
                    toaster.success({
                        title: "Organization Name Updated",
                        description: "The organization name has been updated successfully."
                    });
                    refetch();
                }
            })}
            title="Edit Organization Name"
            updateDisallowed={!newName.trim()}
        >
            <InputComponent
                label="Update Organization Name"
                value={newName}
                onChange={(v) => setNewName(v)}
                placeholder="Enter new name of the organization"
                errortext={!newName ? "Name cannot be empty" : ""}
            />
        </UpdateBtn>
    );
}