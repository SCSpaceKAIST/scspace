import { Checkbox, } from "@chakra-ui/react";

export default function CheckComponent({ label, onChange = () => null }: {
  label: string;
  onChange?: (e: boolean) => any;
}) {
  return (
    <Checkbox.Root
      bg="white"
      size="sm"
      onCheckedChange={e => onChange(!!e.checked)}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Label
        mr={2}
      >
        {label}
      </Checkbox.Label>
      <Checkbox.Control />
    </Checkbox.Root>
  );
}
