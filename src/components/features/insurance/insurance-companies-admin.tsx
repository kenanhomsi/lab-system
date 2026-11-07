"use client";

import { useEffect, useState } from "react";
import { ActionIcon, Button, Card, Group, Modal, Stack, Switch, Table, Text, TextInput, Title } from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";

type Company = { id: number; name: string; isActive: boolean };

const unwrap = (value: unknown): Company[] => {
  if (value && typeof value === "object" && "data" in value) {
    return unwrap((value as { data: unknown }).data);
  }
  return Array.isArray(value) ? value as Company[] : [];
};

/** Lets administrators maintain the insurance-company lookup used by patient requests. */
export function InsuranceCompaniesAdmin() {
  const locale = useLocale();
  const ar = locale.startsWith("ar");
  const [items, setItems] = useState<Company[]>([]);
  const [editing, setEditing] = useState<Company | null>(null);
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await axiosInstanceFront.get<unknown>("/admin/insurance-companies");
    setItems(unwrap(response.data));
  };

  useEffect(() => { void load(); }, []);

  const openForm = (company?: Company) => {
    setEditing(company ?? null);
    setName(company?.name ?? "");
    setIsActive(company?.isActive ?? true);
    setOpened(true);
  };

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: name.trim(), isActive };
      if (editing) await axiosInstanceFront.put(`/admin/insurance-companies/${editing.id}`, payload);
      else await axiosInstanceFront.post("/admin/insurance-companies", payload);
      setOpened(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm(ar ? "حذف شركة التأمين؟" : "Delete this insurance company?")) return;
    await axiosInstanceFront.delete(`/admin/insurance-companies/${id}`);
    await load();
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>{ar ? "شركات التأمين" : "Insurance companies"}</Title>
          <Text c="dimmed">{ar ? "إدارة قائمة الشركات المتاحة في طلبات موافقات التأمين." : "Manage the companies available in insurance approval requests."}</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={() => openForm()}>{ar ? "إضافة شركة" : "Add company"}</Button>
      </Group>
      <Card withBorder radius="lg">
        <Table striped highlightOnHover>
          <Table.Thead><Table.Tr><Table.Th>{ar ? "الاسم" : "Name"}</Table.Th><Table.Th>{ar ? "الحالة" : "Status"}</Table.Th><Table.Th /></Table.Tr></Table.Thead>
          <Table.Tbody>
            {items.map((company) => (
              <Table.Tr key={company.id}>
                <Table.Td>{company.name}</Table.Td>
                <Table.Td>{company.isActive ? (ar ? "فعالة" : "Active") : (ar ? "متوقفة" : "Inactive")}</Table.Td>
                <Table.Td><Group justify="flex-end"><ActionIcon variant="subtle" onClick={() => openForm(company)}><IconEdit size={16} /></ActionIcon><ActionIcon color="red" variant="subtle" onClick={() => void remove(company.id)}><IconTrash size={16} /></ActionIcon></Group></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
      <Modal opened={opened} onClose={() => setOpened(false)} title={editing ? (ar ? "تعديل الشركة" : "Edit company") : (ar ? "شركة جديدة" : "New company")} centered>
        <Stack>
          <TextInput label={ar ? "اسم الشركة" : "Company name"} value={name} onChange={(event) => setName(event.currentTarget.value)} required />
          <Switch label={ar ? "فعالة" : "Active"} checked={isActive} onChange={(event) => setIsActive(event.currentTarget.checked)} />
          <Button loading={saving} onClick={() => void save()}>{ar ? "حفظ" : "Save"}</Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
