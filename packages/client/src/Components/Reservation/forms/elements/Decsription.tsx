import { Dispatch, SetStateAction } from "react";
import TextareaComponent from "../utils/Textarea";

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
