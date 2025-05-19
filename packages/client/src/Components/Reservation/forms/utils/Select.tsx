import {
  Select,
  Portal,
  createListCollection,
  Flex,
} from "@chakra-ui/react";
import CheckComponent from "./Checkbox";
import { useState } from "react";

export default function SelectComponent({
  label,
  checkboxLabel,
  placeholder,
  optionList
}: {
  label: string,
  checkboxLabel?: {
    [key: string]: string;
  }
  placeholder: string
  optionList: {
    label: string,
    value: string
  }[]
}) {
  const options = createListCollection({
    items: optionList,
  });

  const [selected, setSelected] = useState<string>(optionList[0].value);

  return (
    <Select.Root
      collection={options}
      value={[selected]}
      onValueChange={(e) => setSelected(e.value[0])}
    >
      <Select.HiddenSelect />
      <Select.Label>
        <Flex
          justify="space-between"
        >
          {label}
          {(checkboxLabel && checkboxLabel[selected]) &&
            <CheckComponent
              label={checkboxLabel[selected]}
            />
          }
        </Flex>
      </Select.Label>
      <Select.Control>
        <Select.Trigger
          rounded="sm"
        >
          <Select.ValueText
            placeholder={placeholder}
          />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {options.items.map((o) => (
              <Select.Item
                item={o}
                key={o.value}
              >
                {o.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
