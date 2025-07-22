import { NumberInput, } from "@chakra-ui/react";
import FieldComponent from "../../atoms/Field";

export default function NumberInputComponent({
  label,
  helpertext,
  errortext,
  disabled,
  min,
  value,
  onChange,
}: {
  label: string;
  helpertext?: string;
  errortext?: string;
  disabled?: boolean;
  min?: number;
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
        bg="white"
        value={value}
        onValueChange={(e) => onChange(e.value)}
        width="100%"
        min={min ?? 0}
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
    </FieldComponent>
  );
}
