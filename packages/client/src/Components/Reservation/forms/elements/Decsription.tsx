import TextareaComponent from "../utils/Textarea";

export function DescriptionForm() {
  return (
    <TextareaComponent
      label="Description"
      placeholder="Input Description"
      helpertext="Helper Text"
    />
  );
}
