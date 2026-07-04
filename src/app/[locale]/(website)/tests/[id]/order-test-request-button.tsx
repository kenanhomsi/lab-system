"use client";

type OrderTestRequestButtonProps = {
  className: string;
  label: string;
  locale: string;
  testId: number;
};

/** Opens the patient test-request modal in place or sends guests through login first. */
export function OrderTestRequestButton({
  className,
  label,
  locale,
}: OrderTestRequestButtonProps) {
  const handleClick = () => {
    const callbackUrl = `/${locale}/patient/test-requests`;
    window.location.href = `/${locale}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
  );
}
