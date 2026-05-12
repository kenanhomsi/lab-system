"use client";

import { Pagination } from "@mantine/core";
import { useSyncExternalStore } from "react";
import classes from "../style.module.scss";
import { useMirror } from "../store";

const emptySubscribe = () => () => {};

const PaginationComp = () => {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const pagination = useMirror("paginationStatic");
  const OnPageNumberChange = useMirror("OnPageNumberChange");
  const { page = 0, limit = 0, count = 1 } = pagination ?? {};

  if (!hydrated) {
    return (
      <div
        className={classes.root}
        style={{ minHeight: "2.25rem" }}
        aria-hidden
      />
    );
  }

  return (
    <>
      {page > 0 && (
        <Pagination
          total={Math.ceil(count / limit)}
          color="#29ADE3"
          radius="md"
          value={page}
          onChange={(newPage) => {
            OnPageNumberChange(newPage);
          }}
          size={"sm"}
          classNames={{
            control: classes.control,
            root: classes.root,
          }}
        />
      )}
    </>
  );
};

export { PaginationComp };
