import { Input, } from "@chakra-ui/react";
import FieldComponent from "./Field";
import { Dispatch, RefObject, SetStateAction } from "react";

export default function InputComponent({
  label,
  placeholder,
  value,
  setValue,
  helpertext,
  errortext,
  disabled,
  ref,
  required = false
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
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
        placeholder={placeholder}
        ref={ref ?? null}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FieldComponent>
  );
}
