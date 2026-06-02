import { SpecialDailyTasksView } from "@/components/features/special-account/SpecialDailyTasksView";
import { Stack } from "@mantine/core";

export default function SpecialDailyTasksPage() {
  return (
    <Stack p={{ base: "sm", md: "md" }}>
      <SpecialDailyTasksView />
    </Stack>
  );
}
