import { Textarea, } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import FieldComponent from "./Field";
import { Dispatch, SetStateAction } from "react";

export default function TextareaComponent({
  label,
  placeholder,
  helpertext,
  errortext,
  disabled,
  value,
  setValue
}: {
  label: string;
  placeholder: string;
  helpertext?: string;
  errortext?: string;
  disabled?: boolean;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: helpertext || null,
        errortext: errortext || null,
        disabled: disabled || false,
        required: true
      }}
    >
      <Textarea
        bg="white"
        autoresize
        resize="none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FieldComponent>
  );
}
