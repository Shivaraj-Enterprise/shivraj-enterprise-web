import { Linkedin, Instagram, Facebook, ExternalLink, Star, Globe, Link as LinkIcon } from "lucide-react";
import type { ElementType } from "react";

export interface SocialItem {
  name: string;
  url: string;
  icon: ElementType;
}

export const socialItems: SocialItem[] = [
  { name: "LinkedIn", url: "https://www.linkedin.com/company/shivraj-enterprisess/?viewasmember=true", icon: Linkedin },
  { name: "Instagram", url: "https://www.instagram.com/shivraj.enterprise/?hl=en", icon: Instagram },
  { name: "Facebook", url: "https://www.facebook.com/Shivraj.Enterprise.1234/", icon: Facebook },
  { name: "Google Reviews", url: "https://g.page/r/cwyjmz32ndejebm/review", icon: Star },
  { name: "Justdial", url: "https://www.jsdl.in/rsl-lji1779101080", icon: Globe },
  { name: "TradeIndia", url: "https://www.tradeindia.com/shivraj-enterprise-162621929", icon: ExternalLink },
  { name: "IndiaMART", url: "https://www.indiamart.com/company/156852222", icon: ExternalLink },
  { name: "Linktree", url: "https://linktr.ee/shivraj_enterprise", icon: LinkIcon },
];

interface SocialLinksProps {
  iconOnly?: boolean;
  variant?: "light" | "dark";
}

const SocialLinks = ({ iconOnly = false, variant = "light" }: SocialLinksProps) => {
  const textCls =
    variant === "dark"
      ? "text-shivraj-200 hover:text-white"
      : "text-shivraj-700 hover:text-shivraj-500";
  const iconCls =
    variant === "dark"
      ? "text-shivraj-300 hover:text-white"
      : "text-shivraj-600 hover:text-shivraj-800";

  if (iconOnly) {
    return (
      <div className="flex flex-wrap gap-3">
        {socialItems.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className={`transition-colors ${iconCls}`}
            title={s.name}
          >
            <s.icon size={20} />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {socialItems.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-sm transition-colors ${textCls}`}
        >
          <s.icon size={16} />
          <span>{s.name}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
