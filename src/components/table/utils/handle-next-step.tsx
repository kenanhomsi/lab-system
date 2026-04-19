"use client";
import { PropsWithChildren } from "react";
import { useMirror, useMirrorRegistry } from "../store";
import { DropResult } from "@hello-pangea/dnd";

const OnDragEnd = (props: PropsWithChildren) => {
  const data = useMirror("data");
  const onReorder = useMirror("onReorder");

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updated = [...data];
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    onReorder?.(updated);
  };

  useMirrorRegistry("onDragEnd", onDragEnd);

  return props;
};

export default OnDragEnd;
