import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}

const GradientText = ({
  children,
  className = "",
  from = "from-shivraj-600",
  via = "via-shivraj-500",
  to = "to-shivraj-800",
}: GradientTextProps) => {
  return (
    <span
      className={`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_6s_linear_infinite] ${className}`}
    >
      {children}
    </span>
  );
};

export default GradientText;
