import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}

const Marquee = ({ children, speed = 30, className = "", pauseOnHover = true }: MarqueeProps) => {
  return (
    <div className={`overflow-hidden relative group ${className}`}>
      <div
        className={`flex gap-8 w-max animate-[marquee_linear_infinite] ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

export default Marquee;
