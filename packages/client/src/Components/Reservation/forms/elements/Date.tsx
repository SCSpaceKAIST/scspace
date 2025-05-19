"use client"

import { useState, useEffect } from "react";
import { Button, Box, } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import FieldComponent from "../utils/Field";

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
