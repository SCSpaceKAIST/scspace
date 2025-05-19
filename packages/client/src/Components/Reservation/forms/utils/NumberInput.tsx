import { NumberInput, } from "@chakra-ui/react";
import FieldComponent from "./Field";

export default function NumberInputComponent({
  label,
  defaultValue,
  helpertext,
  errortext,
  disabled,
}: {
  label: string,
  defaultValue: string,
  helpertext?: string,
  errortext?: string,
  disabled?: boolean,
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
        defaultValue={defaultValue}
        width="100%"
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
    </FieldComponent>
  );
}
