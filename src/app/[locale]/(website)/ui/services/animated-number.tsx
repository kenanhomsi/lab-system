"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2.5,
  className = "",
}: AnimatedNumberProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUp end={value} duration={duration} separator="," />
      ) : (
        "0"
      )}
    </span>
  );
}
