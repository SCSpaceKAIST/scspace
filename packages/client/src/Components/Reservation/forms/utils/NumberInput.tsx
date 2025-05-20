import { NumberInput, } from "@chakra-ui/react";
import FieldComponent from "./Field";
import { Dispatch, SetStateAction } from "react";

export default function NumberInputComponent({
  label,
  helpertext,
  errortext,
  disabled,
  value,
  onChange,
}: {
  label: string;
  helpertext?: string;
  errortext?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => any;
}) {
  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: helpertext || null,
        errortext: errortext || null,
        disabled: disabled || false,
      }}
    >
      <NumberInput.Root
        value={value}
        onValueChange={(e) => onChange(e.value)}
        width="100%"
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
    </FieldComponent>
  );
}
