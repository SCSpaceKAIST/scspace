"use client"

import { useState, useEffect } from "react";
import {
  Select,
  Portal,
  createListCollection,
  Field,
  Input,
  NumberInput,
  Textarea,
  Checkbox,
  Flex,
  Button,
  Box,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CheckComponent({
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

function SelectComponent({
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

function FieldComponent({
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

function InputComponent({
  label,
  placeholder,
  helpertext,
  errortext,
  disabled,
}: {
  label: string,
  placeholder: string,
  helpertext?: string,
  errortext?: string,
  disabled?: boolean,
}) {
  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: helpertext || null,
        errortext: errortext || null,
        disabled: disabled || false,
      }}
    >
      <Input
        placeholder={placeholder}
      />
    </FieldComponent>
  );
}

function TextareaComponent({
  label,
  placeholder,
  helpertext,
  errortext,
  disabled,
}: {
  label: string,
  placeholder: string,
  helpertext?: string,
  errortext?: string,
  disabled?: boolean,
}) {
  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: helpertext || null,
        errortext: errortext || null,
        disabled: disabled || false,
      }}
    >
      <Textarea
        autoresize
        resize="none"
        placeholder={placeholder}
      />
    </FieldComponent>
  );
}

function NumberInputComponent({
  label,
  defaultValue,
  helpertext,
  errortext,
  disabled,
}: {
  label: string,
  defaultValue: string,
  helpertext?: string,
  errortext?: string,
  disabled?: boolean,
}) {
  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: helpertext || null,
        errortext: errortext || null,
        disabled: disabled || false,
      }}
    >
      <NumberInput.Root
        defaultValue={defaultValue}
        width="100%"
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
    </FieldComponent>
  );
}

export function SpaceForm() {
  const spaces = [
    { label: "Space 1", value: "1" },
    { label: "Space 2", value: "2" },
  ]

  return (
    <SelectComponent
      label="Space Name"
      placeholder="Select Space"
      optionList={spaces}
      checkboxLabel="using Lobby"
    />
  );
}

export function OrganizationForm() {
  const organizations = [
    { label: "Org 1", value: "1" },
    { label: "Org 2", value: "2" },
  ]

  return (
    <SelectComponent
      label="Organization Name"
      placeholder="Select Organization"
      optionList={organizations}
    />
  );
}

export function TitleForm() {
  return (
    <InputComponent
      label="Title"
      placeholder="Input Title"
      helpertext="이런것도 있음"
    />
  );
}

export function DescriptionForm() {
  return (
    <TextareaComponent
      label="Description"
      placeholder="Input Description"
      helpertext="Helper Text"
    />
  );
}

export function InnerPeopleForm() {
  return (
    <NumberInputComponent
      label="Inner Participant Number"
      defaultValue="10"
    />
  );
}

export function OuterPeopleForm() {
  return (
    <NumberInputComponent
      label="Outer Participant Number"
      defaultValue="0"
    />
  );
}

export function FoodForm() {
  return (
    <InputComponent
      label="Food"
      placeholder="explanation about food"
    />
  );
}

export function DeskForm() {
  return (
    <NumberInputComponent
      label="Desk"
      defaultValue="0"
    />
  );
}

export function ChairForm() {
  return (
    <NumberInputComponent
      label="Chair"
      defaultValue="0"
    />
  );
}

export function WorkerForm() {
  return (
    <NumberInputComponent
      label="Worker"
      defaultValue="0"
    />
  );
}

export function DateForm({
  label
}: {
  label: string
}) {
  const [d, setD] = useState(new Date());
  const [text, setText] = useState("");

  useEffect(() => {
    setText(d.toLocaleString());
  }, [d]);

  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: null,
        errortext: null,
        disabled: false,
      }}
    >
      <Box width="100%">
        <DatePicker
          selected={d}
          onChange={(date) => {
            if (date) setD(date);
          }}
          wrapperClassName="datepicker"
          showTimeInput
          customInput={
            <Button
              variant="outline"
              rounded="sm"
              width="100%"
            >
              {text}
            </Button>
          }
        />
      </Box>
    </FieldComponent>
  );
}
