"use client";

import { WordRotate } from "@/components/ui/word-rotate";

type HeroWordRotateProps = {
  words: string[];
};

export function HeroWordRotate({ words }: HeroWordRotateProps) {
  return (
    <WordRotate
      words={words}
      duration={2800}
      className="text-[#009cc2]"
      motionProps={{
        initial: { opacity: 0, y: -24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 24 },
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    />
  );
}
