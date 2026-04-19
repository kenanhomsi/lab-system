"use client";
import { useShallowEffect } from "@mantine/hooks";
import { useEffect } from "react";

const useCompareEffect = (type: "value" | "reference") => {
  if (type === "value") return useShallowEffect;
  return useEffect;
};

export { useCompareEffect };
