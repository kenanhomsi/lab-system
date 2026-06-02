"use client";

import { specialAccountService } from "./special-service";
import {
  Button,
  Card,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

/**
 * Form to record a new special-account payment.
 */
export function SpecialNewPaymentForm() {
  const t = useTranslations("specialPages");
  const locale = useLocale();
  const router = useRouter();
  const [date, setDate] = useState<string | null>(dayjs().format("YYYY-MM-DD"));
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");

  const lookupsQuery = useQuery({
    queryKey: ["special-descriptions"],
    queryFn: () => specialAccountService.listDescriptions(),
  });

  const options = (lookupsQuery.data ?? []).map((item) => ({
    value: item.id,
    label: locale === "ar" ? item.labelAr : item.labelEn,
  }));

  const mutation = useMutation({
    mutationFn: () =>
      specialAccountService.createPayment({
        date: dayjs(date ?? undefined).format("YYYY-MM-DD"),
        amount,
        description,
        note,
      }),
    onSuccess: () => {
      notifications.show({
        color: "green",
        title: t("paymentSaved"),
        message: t("paymentSavedHint"),
      });
      router.push("/special/account-statement");
    },
  });

  return (
    <Card withBorder padding="lg" maw={560}>
      <Stack gap="md">
        <Text fw={700} size="xl">
          {t("newPayment")}
        </Text>
        <DateInput label={t("date")} value={date} onChange={setDate} />
        <NumberInput
          label={t("amount")}
          min={0}
          value={amount}
          onChange={(v) => setAmount(Number(v) || 0)}
        />
        <Select
          label={t("description")}
          data={options}
          value={description || null}
          onChange={(v) => setDescription(v ?? "")}
          placeholder={t("selectOption")}
        />
        <Textarea
          label={t("note")}
          placeholder={t("optionalNote")}
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
        />
        <Button loading={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? t("saving") : t("save")}
        </Button>
      </Stack>
    </Card>
  );
}
