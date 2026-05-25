"use client";

import { Highlighter } from "@/components/ui/highlighter";

type EditorialHighlightedHeadingProps = {
  id: string;
  before: string;
  highlight: string;
  className?: string;
};

export function EditorialHighlightedHeading({
  id,
  before,
  highlight,
  className,
}: EditorialHighlightedHeadingProps) {
  return (
    <h2 id={id} className={className}>
      {before}{" "}
      <Highlighter
        action="underline"
        color="#009cc2"
        strokeWidth={2}
        animationDuration={700}
        iterations={2}
        isView
      >
        {highlight}
      </Highlighter>
    </h2>
  );
}
