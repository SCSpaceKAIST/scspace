import { Textarea, } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import FieldComponent from "./Field";

export default function TextareaComponent({
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
      <Textarea
        autoresize
        resize="none"
        placeholder={placeholder}
      />
    </FieldComponent>
  );
}
