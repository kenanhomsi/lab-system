import { SpecialNewPaymentForm } from "@/components/features/special-account/SpecialNewPaymentForm";
import { Stack } from "@mantine/core";

export default function SpecialNewPaymentPage() {
  return (
    <Stack p={{ base: "sm", md: "md" }}>
      <SpecialNewPaymentForm />
    </Stack>
  );
}
