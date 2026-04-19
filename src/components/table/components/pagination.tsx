"use client";

import { Pagination } from "@mantine/core";
import classes from "../style.module.scss";
import { useMirror } from "../store";

const PaginationComp = () => {
  const pagination = useMirror("paginationStatic");
  const OnPageNumberChange = useMirror("OnPageNumberChange");
  const { page = 0, limit = 0, count = 1 } = pagination ?? {};
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
