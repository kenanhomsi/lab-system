"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMirror } from "./store";

const Utlis = (props: PropsWithChildren) => {
  const { children } = props;
  const success = useMirror("success");
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      router.push(`/${locale}/login`);
    }, 2000);
    return () => clearTimeout(timer);
  }, [success, router, locale]);

  return <>{children}</>;
};

export default Utlis;
