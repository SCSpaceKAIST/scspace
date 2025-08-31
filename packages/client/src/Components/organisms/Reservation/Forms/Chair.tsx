import { Text } from "@chakra-ui/react";
import FieldComponent from "@scspace-client/Components/atoms/Field";

export function ChairForm() {
  return (
    <FieldComponent
      options={{
        label: "Chair",
      }}
    >
      <Text color={"gray"}>Please make rental</Text>
    </FieldComponent>
  );
}
