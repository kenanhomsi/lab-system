"use client";

import { Stack } from "@mantine/core";
import { Table } from "@/components/table";
import { BannersHeader } from "./components";
import { useMirror } from "./store";

const UI = () => {
    const schema = useMirror("schema");
    const isLoading = useMirror("isPending");
    const setPageNumber = useMirror("setPageNumber");
    const bannersData = useMirror("bannersData") ?? [];
    const setActiveModal = useMirror("setActiveModal");

    return (
        <Stack>
            <Table
                type="normal"
                isLoading={isLoading}
                schema={schema}
                OnPageNumberChange={setPageNumber}
                data={bannersData}
                paginationStatic={{
                    count: bannersData.length,
                    limit: 20,
                    page: 1,
                }}
            >
                <Table.Header>
                    <BannersHeader
                        totalBanners={bannersData.length}
                        visibleBanners={bannersData.length}
                        onOpenCreate={() => {
                            setActiveModal("create");
                        }}
                    />
                </Table.Header>
            </Table>
        </Stack>
    );
};

export { UI };
