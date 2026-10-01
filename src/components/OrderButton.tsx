import { siteConfig } from "@/config/site";
import { ArrowIcon } from "./Icons";
export function OrderButton({
  children = "PEDIR AGORA",
  className = "",
  label,
}: {
  children?: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <a
      className={`order-button ${className}`}
      href={siteConfig.orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || "Pedir agora — abre em uma nova aba"}
    >
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}
