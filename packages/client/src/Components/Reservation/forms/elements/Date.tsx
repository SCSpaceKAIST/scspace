"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button, Box, } from "@chakra-ui/react";
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

  useEffect(() => {
    setText(date.toLocaleDateString());
  }, [date]);

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
          selected={date}
          onChange={(date) => {
            if (date) setDate(date);
          }}
          wrapperClassName="datepicker"
          customInput={
            <Button
              variant="outline"
              rounded="sm"
              width="100%"
            >
              {text}
            </Button>
          }
          maxDate={maxDate}
          minDate={minDate}
        />
      </Box>
    </FieldComponent>
  );
}
