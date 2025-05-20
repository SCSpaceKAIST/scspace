import {
  Select,
  Portal,
  createListCollection,
  Flex,
  Stack,
  Span,
} from "@chakra-ui/react";
import CheckComponent from "./Checkbox";
import { useState } from "react";

export interface ISelectOption {
  label: string;
  value: string;
  description?: string;
}

export default function SelectComponent({
  label,
  checkboxLabel,
  optionList,
  onChange
}: {
  label: string;
  checkboxLabel?: {
    [key: string]: string;
  } | string;
  optionList: ISelectOption[];
  onChange: (e: ISelectOption) => any;
}) {
  const options = createListCollection({
    items: optionList,
  });

  const [_value, _setValue] = useState<string>(optionList[0].value);
  const [_label, _setLabel] = useState<string>(optionList[0].label);
  const [_dscrp, _setDscrp] = useState<string>(optionList[0].description ?? "");

  return (
    <Select.Root
      size="lg"
      collection={options}
      value={[_value]}
      onValueChange={(e) => {
        _setValue(e.value[0]);
        _setDscrp(e.items[0].description ?? "");
        _setLabel(e.items[0].label);
        onChange(e.items[0]);
      }}
    >
      <Select.HiddenSelect />
      <Select.Label>
        <Flex justify="space-between">
          {label}
          {(checkboxLabel && (
            (typeof checkboxLabel === "string") ? (
              <CheckComponent label={checkboxLabel} />
            ) : (checkboxLabel[_label] && (
              <CheckComponent label={checkboxLabel[_label]} />
            ))
          ))}
        </Flex>
      </Select.Label>
      <Select.Control>
        <Select.Trigger
          rounded="sm"
        >
          <Stack gap={0} width="100%">
            <Select.ValueText>
              {_label}
            </Select.ValueText>
            <Span color="fg.muted" textStyle="xs">
              {_dscrp}
            </Span>
          </Stack>
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
                <Stack gap={0}>
                  <Select.ItemText>
                    {o.label}
                  </Select.ItemText>
                  <Span color="fg.muted" textStyle="xs">
                    {o.description ?? ""}
                  </Span>
                </Stack>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root >
  );
}
