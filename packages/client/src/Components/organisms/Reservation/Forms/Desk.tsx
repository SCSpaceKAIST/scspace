import { Text } from "@chakra-ui/react";
import FieldComponent from "@scspace-client/Components/atoms/Field";

export function DeskForm() {
  return (
    <FieldComponent
      options={{
        label: "Desk",
      }}
    >
      <Text>Please make rental</Text>
    </FieldComponent>
  );
}

