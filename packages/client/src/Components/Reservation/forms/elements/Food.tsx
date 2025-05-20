import { Dispatch, SetStateAction } from "react";
import InputComponent from "../utils/Input";

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
    />
  );
}
