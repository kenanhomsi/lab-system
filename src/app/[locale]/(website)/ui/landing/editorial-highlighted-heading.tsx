type EditorialHighlightedHeadingProps = {
  id: string;
  before: string;
  highlight: string;
  className?: string;
};

/** Server-rendered heading with a CSS underline highlight (no motion/rough-notation). */
export function EditorialHighlightedHeading({
  id,
  before,
  highlight,
  className,
}: EditorialHighlightedHeadingProps) {
  return (
    <h2 id={id} className={className}>
      {before}{" "}
      <span className="underline decoration-[#009cc2] decoration-2 underline-offset-[6px]">
        {highlight}
      </span>
    </h2>
  );
}
