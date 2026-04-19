"use client";
import { Box, Center, TableTd } from "@mantine/core";
import { DataTable, DataTableDraggableRow } from "mantine-datatable";
import { PaginationComp } from "../components/pagination";
import { useMirror } from "../store";
import styles from "../style.module.scss";
import { SkeletonTable } from "../components";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import clsx from "clsx";
const NormalTable = () => {
  const schema = useMirror("schema");
  const data = useMirror("data");
  const headerComp = useMirror("headerComp");
  const isLoading = useMirror("isLoading");
  const withDrag = useMirror("withDrag");
  const onDragEnd = useMirror("onDragEnd");
  const hasRecords = Array.isArray(data) && data.length > 0;
  const minHeight = hasRecords ? undefined : "20rem";

  return (
    <Box className={styles.tableBox}>
      {headerComp}
      {isLoading && <SkeletonTable rows={5} columns={schema?.length || 4} />}
      {!isLoading && (
        <>
          {withDrag ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable-table">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <DataTable
                      columns={[
                        { accessor: "", hiddenContent: true, width: 30 },
                        ...schema,
                      ]}
                      records={data}
                      minHeight={minHeight}
                      highlightOnHover
                      verticalSpacing="xs"
                      rowClassName={() => styles.rowStyles}
                      horizontalSpacing="xs"
                      classNames={{
                        header: styles.headerCell,
                        root: styles.cell,
                      }}
                      tableWrapper={({ children }) => (
                        <div className={styles.tableScrollWrapper}>{children}</div>
                      )}
                      rowFactory={({ record, index, rowProps, children }) => (
                        <Draggable
                          draggableId={record.id}
                          index={index}
                          key={record.id}
                        >
                          {(provided, snapshot) => (
                            <DataTableDraggableRow
                              isDragging={snapshot.isDragging}
                              {...rowProps}
                              {...provided.draggableProps}
                              className={clsx(
                                rowProps.className,
                                styles.draggableRow,
                              )}
                            >
                              <TableTd>
                                <Center
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
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
          ) : (
            <>
              <DataTable
                columns={schema}
                //eslint-disable-next-line  @typescript-eslint/no-explicit-any
                records={data as any}
                minHeight={minHeight}
                noRecordsText={''}
                noRecordsIcon={<></>}
                highlightOnHover
                verticalSpacing="xs"
                rowClassName={() => styles.rowStyles}
                horizontalSpacing="xs"

                classNames={{
                  header: styles.headerCell,
                  root: styles.cell,
                }}
              />
            </>
          )}
          <PaginationComp />
        </>
      )}
    </Box>
  );
};

export { NormalTable };
