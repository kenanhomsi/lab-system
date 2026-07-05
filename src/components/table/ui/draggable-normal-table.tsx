"use client";

import { Center, TableTd } from "@mantine/core";
import { DataTable, DataTableDraggableRow } from "mantine-datatable";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import clsx from "clsx";
import type { DataTableColumn } from "mantine-datatable";
import styles from "../style.module.scss";

type DraggableNormalTableProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- record shape follows table data
  schema: DataTableColumn<any>[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  records: any[];
  minHeight?: string;
  emptyState: React.ReactNode;
  striped: boolean;
  highlightOnHover: boolean;
  verticalSpacing: "xs" | "sm" | "md" | "lg" | "xl";
  horizontalSpacing: "xs" | "sm" | "md" | "lg" | "xl";
  tableClassNamesMerged: {
    header?: string;
    root?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowClassNameResolved: (record: any) => string;
  onDragEnd: (result: DropResult) => void;
};

/**
 * Drag-and-drop table variant loaded only when row reordering is enabled.
 */
export function DraggableNormalTable({
  schema,
  records,
  minHeight,
  emptyState,
  striped,
  highlightOnHover,
  verticalSpacing,
  horizontalSpacing,
  tableClassNamesMerged,
  rowClassNameResolved,
  onDragEnd,
}: DraggableNormalTableProps) {
  const columns = schema ?? [];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-table">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <DataTable
              w="100%"
              columns={[{ accessor: "", hiddenContent: true, width: 30 }, ...columns]}
              records={records}
              minHeight={minHeight}
              emptyState={emptyState}
              noRecordsText=""
              striped={striped}
              highlightOnHover={highlightOnHover}
              verticalSpacing={verticalSpacing}
              rowClassName={rowClassNameResolved}
              horizontalSpacing={horizontalSpacing}
              classNames={tableClassNamesMerged}
              tableWrapper={({ children }) => (
                <div className={styles.tableScrollWrapper}>{children}</div>
              )}
              rowFactory={({ record, index, rowProps, children }) => (
                <Draggable draggableId={String(record.id)} index={index} key={String(record.id)}>
                  {(dragProvided, snapshot) => (
                    <DataTableDraggableRow
                      isDragging={snapshot.isDragging}
                      {...rowProps}
                      {...dragProvided.draggableProps}
                      className={clsx(rowProps.className, styles.draggableRow)}
                    >
                      <TableTd>
                        <Center {...dragProvided.dragHandleProps} ref={dragProvided.innerRef}>
                          <IconGripVertical size={16} />
                        </Center>
                      </TableTd>
                      {children}
                    </DataTableDraggableRow>
                  )}
                </Draggable>
              )}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
