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

  return <>{children}</>;
};

export { Init };
