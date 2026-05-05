"use client";

import { PropsWithChildren } from "react";
import { FactoryProps } from "./factory";
import { useMirrorRegistry } from "./store";

const Init = (props: FactoryProps & PropsWithChildren) => {
  const {
    children,
    OnPageNumberChange,
    paginationStatic,
    data,
    schema,
    expandedRowIds,
    isLoading,
    type,
    onReorder,
    withDrag,
    onRowClick,
    tableEmptyState,
    tableRowClassName,
    dataTableClassNames,
    tableStriped,
    tableHighlightOnHover,
    dataTableVerticalSpacing,
    dataTableHorizontalSpacing,
  } = props;

  useMirrorRegistry("OnPageNumberChange", OnPageNumberChange);
  useMirrorRegistry("onRowClick", onRowClick);
  useMirrorRegistry("paginationStatic", paginationStatic);
  useMirrorRegistry("data", data);
  useMirrorRegistry("schema", schema);
  useMirrorRegistry("expandedRowIds", expandedRowIds);
  useMirrorRegistry("type", type);
  useMirrorRegistry("isLoading", isLoading);
  useMirrorRegistry("onReorder", onReorder);
  useMirrorRegistry("withDrag", withDrag);
  useMirrorRegistry("tableEmptyState", tableEmptyState);
  useMirrorRegistry("tableRowClassName", tableRowClassName);
  useMirrorRegistry("dataTableClassNames", dataTableClassNames);
  useMirrorRegistry("tableStriped", tableStriped);
  useMirrorRegistry("tableHighlightOnHover", tableHighlightOnHover);
  useMirrorRegistry("dataTableVerticalSpacing", dataTableVerticalSpacing);
  useMirrorRegistry("dataTableHorizontalSpacing", dataTableHorizontalSpacing);

  return <>{children}</>;
};

export { Init };
