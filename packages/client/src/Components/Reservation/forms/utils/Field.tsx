import { Field, } from "@chakra-ui/react";

export default function FieldComponent({
  options,
  children
}: {
  options: {
    label: string,
    helpertext: string | null,
    errortext: string | null,
    disabled: boolean | false
  },
  children: React.ReactNode,
}) {
  return (
    <Field.Root
      invalid={options?.errortext !== null}
      disabled={options?.disabled}
    >
      <Field.Label>
        {options.label}
      </Field.Label>
      {children}
      {options.helpertext &&
        <Field.HelperText>
          {options.helpertext}
        </Field.HelperText>
      }
      {options.errortext &&
        <Field.ErrorText>
          {options.errortext}
        </Field.ErrorText>
      }
    </Field.Root>
  );
}
