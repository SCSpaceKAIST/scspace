import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import { Dispatch, SetStateAction } from "react";

export function TitleForm({ title, setTitle }: {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}) {
  return (
    <InputComponent
      label="Title"
      placeholder="Enter Title"
      value={title}
      onChange={setTitle}
      required={true}
    />
  );
}
