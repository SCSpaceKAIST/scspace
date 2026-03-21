import {
  Select,
  Portal,
  createListCollection,
  Flex,
  Stack,
  Span,
  Text,
} from "@chakra-ui/react";
import CheckComponent from "./Checkbox";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { SmallLoading } from "@scspace-client/Components/atoms/Loading";

export interface ISelectOption {
  label: string;
  value: string;
  description?: string;
}

export default function SelectComponent({
  inDialog,
  label,
  checkboxLabel,
  optionList,
  defaultValue,
  required,
  onChange,
  setCheck = () => null
}: {
  inDialog?: boolean;
  label: string;
  checkboxLabel?: {
    [key: string]: string;
  } | string;
  optionList: ISelectOption[];
  onChange: (e: ISelectOption) => any;
  defaultValue?: string;
  required?: boolean;
  setCheck?: Dispatch<SetStateAction<boolean>>;
}) {
  const options = useMemo(() => createListCollection({
    items: optionList,
  }), [optionList]);

  const [_value, _setValue] = useState<string>("");

  const selectedOption = useMemo(() => {
    if (optionList.length === 0) return null;

    return optionList.find((option) => option.value === _value)
      ?? optionList.find((option) => option.value === defaultValue)
      ?? optionList[0];
  }, [_value, defaultValue, optionList]);

  useEffect(() => {
    if (optionList.length === 0) return;

    const hasCurrentValue = optionList.some((option) => option.value === _value);
    if (hasCurrentValue) return;

    const nextValue = optionList.find((option) => option.value === defaultValue)?.value
      ?? optionList[0].value
      ?? "";

    _setValue(nextValue);
  }, [_value, defaultValue, optionList]);

  return (options.items.length === 0) ? (
    <SmallLoading />
  ) : (
    <Select.Root
      size="lg"
      collection={options}
      value={[_value]}
      onValueChange={(e) => {
        const selectedItem = e.items[0];
        if (!selectedItem) return;

        _setValue(selectedItem.value);
        onChange(selectedItem);
      }}
    >
      <Select.HiddenSelect />
      <Select.Label>
        <Flex justify="space-between">
          <Span>
            {label} {required && <Span color="fg.error">*</Span>}
          </Span>
          {(checkboxLabel && (
            (typeof checkboxLabel === "string") ? (
              <CheckComponent label={checkboxLabel}
              />
            ) : (selectedOption && checkboxLabel[selectedOption.label] && (
              <CheckComponent
                label={checkboxLabel[selectedOption.label]}
                onChange={(e) => setCheck(e)}
              />
            ))
          ))}
        </Flex>
      </Select.Label>
      <Select.Control>
        <Select.Trigger
          rounded="sm"
          bg="white"
          cursor="pointer"
        >
          <Select.ValueText>
            <Stack gap={0} m={0} p={0}>
              <Text>
                {selectedOption?.label ?? ""}
              </Text>
              <Span color="fg.muted" textStyle="xs">
                {selectedOption?.description ?? ""}
              </Span>
            </Stack>
          </Select.ValueText>
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal disabled={inDialog}>
        <Select.Positioner>
          <Select.Content cursor="pointer" minW="fit-content">
            {options.items.map((o) => (
              <Select.Item
                item={o}
                key={o.value}
              >
                <Stack gap={0}>
                  <Select.ItemText whiteSpace="nowrap">
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
