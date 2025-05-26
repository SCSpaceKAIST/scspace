import { Checkbox, } from "@chakra-ui/react";

export default function CheckComponent({ label, onChange = () => null }: {
  label: string;
  onChange?: (e: boolean) => any;
}) {
  return (
    <Checkbox.Root
      size="sm"
      onCheckedChange={e => onChange(!!e.checked)}
      variant="outline"
    >
      <Checkbox.HiddenInput />
      <Checkbox.Label>
        {label}
      </Checkbox.Label>
      <Checkbox.Control bg="white" />
    </Checkbox.Root>
  );
}
