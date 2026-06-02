import { SpecialAccountStatementView } from "@/components/features/special-account/SpecialAccountStatementView";
import { Stack } from "@mantine/core";

export default function SpecialAccountStatementPage() {
  return (
    <Stack p={{ base: "sm", md: "md" }}>
      <SpecialAccountStatementView />
    </Stack>
  );
}
