"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button, Box, VStack, useBreakpointValue, Center, Dialog, Portal, CloseButton, } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import FieldComponent from "../utils/Field";

export function DateForm({
  label,
  date,
  setDate,
  maxDate,
  minDate,
}: {
  label: string;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  maxDate?: Date;
  minDate?: Date
}) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setText(date.toLocaleDateString());
  }, [date]);

  const isWide = useBreakpointValue({ base: false, md: true });

  return (
    <FieldComponent
      options={{
        label: label,
        helpertext: null,
        errortext: null,
        disabled: false,
      }}
    >
      <Dialog.Root size={isWide ? "xs" : "full"} open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Trigger asChild width="100%">
          <Button variant="outline" width="100%" bg="white">
            {text}
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  Pick Date
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Center>
                  <DatePicker
                    wrapperClassName="datepicker"
                    selected={date}
                    onChange={(e) => {
                      if (e) setDate(e);
                      setOpen(false);
                    }}
                    inline
                    maxDate={maxDate}
                    minDate={minDate}
                  />
                </Center>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </FieldComponent>
  );
}
