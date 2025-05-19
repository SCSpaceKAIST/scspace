import { Input, } from "@chakra-ui/react";
import FieldComponent from "./Field";

export default function InputComponent({
  label,
  placeholder,
  helpertext,
  errortext,
  disabled,
}: {
  label: string,
  placeholder: string,
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
      <Input
        placeholder={placeholder}
      />
    </FieldComponent>
  );
}
