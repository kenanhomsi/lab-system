import { SpecialNewExpenseForm } from "@/components/features/special-account/SpecialNewExpenseForm";
import { Stack } from "@mantine/core";

export default function SpecialNewExpensePage() {
  return (
    <Stack p={{ base: "sm", md: "md" }}>
      <SpecialNewExpenseForm />
    </Stack>
  );
}
