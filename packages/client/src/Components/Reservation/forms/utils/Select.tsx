import {
  Select,
  Portal,
  createListCollection,
  Flex,
} from "@chakra-ui/react";
import CheckComponent from "./Checkbox";

export default function SelectComponent({
  label,
  checkboxLabel,
  placeholder,
  optionList
}: {
  label: string,
  checkboxLabel?: string
  placeholder: string
  optionList: {
    label: string,
    value: string
  }[]
}) {
  const options = createListCollection({
    items: optionList,
  });

  return (
    <Select.Root
      collection={options}
      defaultValue={[optionList[0].value]}
    >
      <Select.HiddenSelect />
      <Select.Label>
        <Flex
          justify="space-between"
        >
          {label}
          {checkboxLabel &&
            <CheckComponent
              label={checkboxLabel}
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
