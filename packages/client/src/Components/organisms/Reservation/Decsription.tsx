import TextareaComponent from "@scspace-client/Components/atoms/Textarea";
import { Dispatch, SetStateAction } from "react";

export function DescriptionForm({ description, setDescription }: {
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}) {
  return (
    <TextareaComponent
      label="Description"
      placeholder="Enter Description"
      value={description}
      setValue={setDescription}
    />
  );
}
