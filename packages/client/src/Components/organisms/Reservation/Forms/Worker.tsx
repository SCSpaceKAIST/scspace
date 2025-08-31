import { Switch } from "@chakra-ui/react";
import FieldComponent from "@scspace-client/Components/atoms/Field";
import { Dispatch, SetStateAction } from "react";

export function WorkerForm({ value, setValue }: {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <FieldComponent
      options={{
        label: "Worker",
      }}
    >
      <Switch.Root
        checked={value}
        onCheckedChange={(v) => setValue(v.checked)}
        colorPalette={"blue"}
      >
        <Switch.HiddenInput />
        <Switch.Control />
        <Switch.Label>
          {value ? "Yes, I need a worker" : "No, I don't need a worker"}
        </Switch.Label>
      </Switch.Root>
    </FieldComponent>
  );
}
