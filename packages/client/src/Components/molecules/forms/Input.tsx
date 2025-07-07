import { Input, } from "@chakra-ui/react";
import FieldComponent from "../../atoms/Field";
import { Dispatch, RefObject, SetStateAction } from "react";

export default function InputComponent({
  label,
  placeholder,
  value,
  onChange,
  helpertext,
  errortext,
  disabled,
  ref,
  required = false
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (s: string) => any;
  helpertext?: string;
  errortext?: string;
  disabled?: boolean;
  ref?: RefObject<HTMLInputElement | null>;
  required?: boolean;
}) {
  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: helpertext || null,
        errortext: errortext || null,
        disabled: disabled || false,
        required: required
      }}
    >
      <Input
        bg="white"
        placeholder={placeholder ?? ""}
        ref={ref ?? null}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldComponent>
  );
}
