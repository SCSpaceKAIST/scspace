import { Textarea, } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import FieldComponent from "../../atoms/Field";

export default function TextareaComponent({
  label,
  placeholder,
  helpertext,
  errortext,
  disabled,
  value,
  required,
  onChange
}: {
  label: string;
  placeholder?: string;
  helpertext?: string;
  errortext?: string;
  disabled?: boolean;
  required?: boolean;
  value: string;
  onChange: (s: string) => any;
}) {
  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: helpertext || null,
        errortext: errortext || null,
        disabled: disabled || false,
        required: required || false
      }}
    >
      <Textarea
        bg="white"
        autoresize
        resize="none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldComponent>
  );
}
