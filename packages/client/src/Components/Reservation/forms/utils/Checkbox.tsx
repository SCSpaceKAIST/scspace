import { Checkbox, } from "@chakra-ui/react";

export default function CheckComponent({
  label,
}: {
  label: string,
}) {
  return (
    <Checkbox.Root
      size="sm"
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
