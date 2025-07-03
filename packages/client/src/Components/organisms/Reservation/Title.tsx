import InputComponent from "@scspace-client/Components/atoms/Input";
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
      setValue={setTitle}
      required={true}
    />
  );
}
