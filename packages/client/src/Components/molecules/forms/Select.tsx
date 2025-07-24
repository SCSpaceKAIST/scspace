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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  setCheck?: Dispatch<SetStateAction<boolean>>;
}) {
  const options = createListCollection({
    items: optionList,
  });

  const [_value, _setValue] = useState<string>(defaultValue ?? "");
  const [_label, _setLabel] = useState<string>("");
  const [_dscrp, _setDscrp] = useState<string>("");

  useEffect(() => {
    if (optionList.length === 0) return;

    _setValue(optionList[0].value ?? "");
    _setLabel(optionList[0].label ?? "");
    _setDscrp(optionList[0].description ?? "");
  }, [optionList.length]);

  return (options.items.length === 0) ? (
    <SmallLoading />
  ) : (
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
              <CheckComponent label={checkboxLabel}
              />
            ) : (checkboxLabel[_label] && (
              <CheckComponent
                label={checkboxLabel[_label]}
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
                {_label}
              </Text>
              <Span color="fg.muted" textStyle="xs">
                {_dscrp}
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
