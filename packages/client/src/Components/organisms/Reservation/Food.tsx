import InputComponent from "@scspace-client/Components/atoms/Input";
import { Dispatch, SetStateAction } from "react";

export function FoodForm({ food, setFood }: {
  food: string;
  setFood: Dispatch<SetStateAction<string>>;
}) {
  return (
    <InputComponent
      label="Food"
      placeholder="explanation about food"
      value={food}
      setValue={setFood}
      helpertext="Please explain what food you will eat in the space if you have."
    />
  );
}

