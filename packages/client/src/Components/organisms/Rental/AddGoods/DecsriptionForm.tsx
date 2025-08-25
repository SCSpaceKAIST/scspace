import TextareaComponent from "@scspace-client/Components/molecules/forms/Textarea";
import { Dispatch, SetStateAction } from "react";

export function GoodsDescriptionForm({ description, setDescription }: {
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}) {
  return (
    <TextareaComponent
      label="Description"
      placeholder="Enter Description"
      value={description}
      onChange={setDescription}
      required
    />
  );
}
