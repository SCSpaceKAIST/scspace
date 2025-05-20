import { Dispatch, SetStateAction } from "react";
import InputComponent from "../utils/Input";

export function TitleForm({ title, setTitle }: {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}) {
  return (
    <InputComponent
      label="Title"
      placeholder="Input Title"
      value={title}
      setValue={setTitle}
    />
  );
}
