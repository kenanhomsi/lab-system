"use client";

import { Select, type SelectProps } from "@mantine/core";
import { useLocale } from "next-intl";
import { useMemo, type SelectHTMLAttributes } from "react";
import { getSyrianCityOptions, SYRIAN_CITIES } from "@/lib/syrian-cities";

type SyrianCitySelectProps = Omit<SelectProps, "data" | "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Mantine select for Syrian governorates and major cities.
 */
export function SyrianCitySelect({ value, onChange, ...props }: SyrianCitySelectProps) {
  const locale = useLocale();
  const data = useMemo(() => getSyrianCityOptions(locale), [locale]);

  return (
    <Select
      {...props}
      data={data}
      searchable
      value={value || null}
      onChange={(nextValue) => onChange(nextValue ?? "")}
    />
  );
}

type SyrianCityNativeSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange" | "children"
> & {
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  className?: string;
};

/**
 * Native select for Syrian governorates and major cities (auth/register flows).
 */
export function SyrianCityNativeSelect({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: SyrianCityNativeSelectProps) {
  const locale = useLocale();

  return (
    <select
      {...props}
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      className={className}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {SYRIAN_CITIES.map((city) => (
        <option key={city.value} value={city.value}>
          {locale.startsWith("ar") ? city.ar : city.en}
        </option>
      ))}
    </select>
  );
}
