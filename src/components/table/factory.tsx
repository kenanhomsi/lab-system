"use client";

import { type ReactNode, PropsWithChildren } from "react";
import { Init } from "./init";
import {
  type DataTableClassNames,
  type DataTableSpacing,
  DataTableColumn,
} from "./store/init";
import { Ui } from "./ui";
import { Content, Header } from "./components";
import { Utils } from "./utils/utils";

type FactoryProps = {
  OnPageNumberChange: (value: number) => void;
  paginationStatic: { page: number; limit: number; count: number };
  type: "normal" | "expansion" | "isLoading";
  expandedRowIds?: string[];
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  schema: DataTableColumn<any>[];
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  data: any[];
  isLoading: boolean;
  withDrag?: boolean;
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  onReorder?: (data: any[]) => void;
  onRowClick?: (id: string) => void;
  tableEmptyState?: ReactNode;
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  tableRowClassName?: (record: any) => string;
  dataTableClassNames?: DataTableClassNames;
  tableStriped?: boolean;
  tableHighlightOnHover?: boolean;
  dataTableVerticalSpacing?: DataTableSpacing;
  dataTableHorizontalSpacing?: DataTableSpacing;
};
const Factory = (props: PropsWithChildren<FactoryProps>) => {
  const { children } = props;
  return (
    <Init {...props}>
      <Utils>
        <Ui />
        {children}
      </Utils>
    </Init>
  );
};
Factory.Header = Header;
Factory.Content = Content;

export { Factory };
export type { FactoryProps };
