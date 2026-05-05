"use client";

import { Table } from "@/components/table";
import { UsersHeader, UsersTableEmptyState } from "./components";
import { useMirror } from "./store";

const UI = () => {
  const schema = useMirror("schema");
  const isLoading = useMirror("isPending");
  const setPageNumber = useMirror("setPageNumber");
  const usersData = useMirror("usersData");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const roleFilter = useMirror("roleFilter");
  const setRoleFilter = useMirror("setRoleFilter");
  const isActiveFilter = useMirror("isActiveFilter");
  const setIsActiveFilter = useMirror("setIsActiveFilter");
  const sortBy = useMirror("sortBy");
  const setSortBy = useMirror("setSortBy");
  const sortDesc = useMirror("sortDesc");
  const setSortDesc = useMirror("setSortDesc");
  const setActiveModal = useMirror("setActiveModal");
  const rolesOptions = useMirror("rolesOptions");
  const hasActiveFilters =
    Boolean(searchValue.trim()) || Boolean(roleFilter.trim()) || isActiveFilter !== "all";
  const tableEmptyState = <UsersTableEmptyState />;
  return (
    <Table
      type="normal"
      isLoading={isLoading}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={usersData?.items || []}
      paginationStatic={{
        count: usersData?.totalCount || 0,
        limit: usersData?.pageSize || 20,
        page: usersData?.page || 1,
      }}
      tableEmptyState={tableEmptyState}
    >
      <Table.Header>
        <UsersHeader
          totalUsers={usersData?.totalCount || 0}
          visibleUsers={usersData?.items?.length || 0}
          hasActiveFilters={hasActiveFilters}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDesc={sortDesc}
          setSortDesc={setSortDesc}
          onOpenCreate={() => setActiveModal("create")}
          onResetFilters={() => {
            setSearchValue("");
            setRoleFilter("");
            setIsActiveFilter("all");
            setSortBy("createdAt");
            setSortDesc(true);
            setPageNumber(1);
          }}
          rolesOptions={rolesOptions}
        />
      </Table.Header>
    </Table>
  );
};

export { UI };
