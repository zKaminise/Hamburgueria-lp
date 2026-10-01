import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement>;
export function ArrowIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function FlameIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 28" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13 1C15 7 9 8 11 13c2-1 3-3 4-5 7 6 8 15 1 18-5 3-12 0-13-5C1 15 6 12 7 7c2 1 2 3 2 4 3-3 4-6 4-10Zm-1 16c-1 3-5 4-3 7 1 2 5 2 6 0 2-3-1-5-3-7Z" />
    </svg>
  );
}
export function WhatsAppIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.7Z" />
      <path d="m8.2 7.5 1.5 2-1 1.2c.8 1.7 1.8 2.7 3.6 3.5l1.1-1 2.2 1.3c.6.4-.1 2-1.4 2-3.2-.1-7.7-4.4-7.7-7.5 0-1.4 1.2-2 1.7-1.5Z" />
    </svg>
  );
}
