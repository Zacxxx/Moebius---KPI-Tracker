import * as React from "react";

/**
 * Unified Icon system
 * ------------------------------------------------------------
 * Improvements over the initial version:
 * 1) Strongly‑typed IconProps with size, title (a11y), and decorative mode.
 * 2) forwardRef + React.memo for better composition and perf.
 * 3) Consistent defaults (24px, strokeLinecap/Join round, strokeWidth=2).
 * 4) ARIA: `title` adds <title> with an id; decorative icons are aria-hidden.
 * 5) Single source of truth via createIcon factory to avoid repetition.
 * 6) Tree‑shakeable named exports.
 */

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, "color"> & {
  /** Width & height, defaults to 24 */
  size?: number | string;
  /** If provided, icon becomes non-decorative and accessible */
  title?: string;
  /** If true (default when no title), icon is aria-hidden */
  decorative?: boolean;
  /** Accept number or string; overrides default 2 */
  strokeWidth?: number | string;
};

function createIcon(
  name: string,
  children: React.ReactNode,
  options: { defaultFill?: string; defaultStroke?: string } = {}
) {
  const { defaultFill = "none", defaultStroke = "currentColor" } = options;

  const Icon = React.memo(
    React.forwardRef<SVGSVGElement, IconProps>(
      (
        {
          size = 24,
          stroke = defaultStroke,
          fill = defaultFill,
          strokeWidth = 2,
          className,
          title,
          decorative = !title,
          ...rest
        },
        ref
      ) => {
        const titleId = React.useId();
        const role = decorative ? undefined : ("img" as const);

        return (
          <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={decorative || undefined}
            aria-labelledby={title ? titleId : undefined}
            role={role}
            focusable="false"
            className={className}
            data-icon={name}
            {...rest}
          >
            {title ? <title id={titleId}>{title}</title> : null}
            {children}
          </svg>
        );
      }
    )
  );

  Icon.displayName = name;
  return Icon;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

export const InfoIcon = createIcon(
  "InfoIcon",
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>
);

export const LineChartIcon = createIcon(
  "LineChartIcon",
  <>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </>
);

export const BarChartIcon = createIcon(
  "BarChartIcon",
  <>
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </>
);

export const TrendingUpIcon = createIcon(
  "TrendingUpIcon",
  <>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </>
);

export const PaletteIcon = createIcon(
  "PaletteIcon",
  <>
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.703-.465-1.17-.465-1.97 0-3.5-1.582-3.5-3.565 0-1.982 1.53-3.565 3.5-3.565 1.97 0 3.5 1.582 3.5 3.565 0 1.982-1.53 3.565-3.5 3.565-.467 0-.873.178-1.17.465-.297.287-.477.685-.477 1.122C10.352 21.254 11.074 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
  </>
);

export const GaugeIcon = createIcon(
  "GaugeIcon",
  <>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </>
);

export const EditIcon = createIcon(
  "EditIcon",
  <>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>
);

export const LibraryIcon = createIcon(
  "LibraryIcon",
  <>
    <rect x="7" y="7" width="14" height="14" rx="2" ry="2" />
    <path d="M3 17V7a2 2 0 0 1 2-2h10" />
  </>
);

export const FolderIcon = createIcon(
  "FolderIcon",
  <>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.9 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
  </>
);

export const MoreHorizontalIcon = createIcon(
  "MoreHorizontalIcon",
  <>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </>
);

export const SparklesIcon = createIcon(
  "SparklesIcon",
  <>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </>
);

export const FolderPlusIcon = createIcon(
  "FolderPlusIcon",
  <>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.9 2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
    <line x1="12" x2="12" y1="10" y2="16" />
    <line x1="9" x2="15" y1="13" y2="13" />
  </>
);

export const HomeIcon = createIcon(
  "HomeIcon",
  <>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </>
);

export const MegaphoneIcon = createIcon(
  "MegaphoneIcon",
  <>
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </>
);

export const SlidersIcon = createIcon(
  "SlidersIcon",
  <>
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="2" x2="6" y1="14" y2="14" />
    <line x1="10" x2="14" y1="8" y2="8" />
    <line x1="18" x2="22" y1="16" y2="16" />
  </>
);

export const UsersIcon = createIcon(
  "UsersIcon",
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

export const BellIcon = createIcon(
  "BellIcon",
  <>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>
);

export const UserIcon = createIcon(
  "UserIcon",
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
);

export const MenuIcon = createIcon(
  "MenuIcon",
  <>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </>
);

export const SearchIcon = createIcon(
  "SearchIcon",
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
);

export const MoebiusIcon = createIcon(
  "MoebiusIcon",
  <>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 6h3c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5v-3c0-.83.67-1.5 1.5-1.5zm1.5 10c-2.76 0-5-2.24-5-5s2.24-5 5-5 .5.22.5.5v9c0 .28-.22.5-.5.5z" fill="currentColor" />
  </>,
  { defaultFill: "none", defaultStroke: "currentColor" }
);

export const ChevronLeftIcon = createIcon(
  "ChevronLeftIcon",
  <path d="m15 18-6-6 6-6" />
);
export const ChevronRightIcon = createIcon(
  "ChevronRightIcon",
  <path d="m9 18 6-6-6-6" />
);
export const ChevronDownIcon = createIcon(
  "ChevronDownIcon",
  <path d="m6 9 6 6 6-6" />
);
export const ChevronUpIcon = createIcon(
  "ChevronUpIcon",
  <path d="m18 15-6-6-6 6" />
);

export const XIcon = createIcon(
  "XIcon",
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
);

export const DatabaseIcon = createIcon(
  "DatabaseIcon",
  <>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </>
);

export const UploadCloudIcon = createIcon(
  "UploadCloudIcon",
  <>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </>
);

export const PlusCircleIcon = createIcon(
  "PlusCircleIcon",
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </>
);

export const BriefcaseIcon = createIcon(
  "BriefcaseIcon",
  <>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </>
);

export const ShapesIcon = createIcon(
  "ShapesIcon",
  <>
    <path d="m21.25 2-2.04 2.04-3.12-3.12-1.02 1.02 3.12 3.12-2.04 2.04 4.08-4.08z" />
    <path d="M16.13 7.87 2.88 21.12" />
    <path d="M11 2.06 2.06 11" />
    <path d="m5 5-3 3" />
    <path d="m22 22-3-3" />
    <path d="m15.5 15.5 3 3" />
    <path d="M2.06 11 11 2.06" />
    <path d="M14.5 14.5 9 9" />
    <path d="M13 2.06 2.06 13" />
    <path d="m20 5-5 5" />
    <circle cx="9" cy="9" r="2" />
    <circle cx="15" cy="15" r="2" />
  </>
);

export const RocketIcon = createIcon(
  "RocketIcon",
  <>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.12S7.18 14.86 6.5 14.5c-.71-.35-2.11-.2-3.12.05s-.9.65-.5 1.45z" />
    <path d="m12 15-3-3a9 9 0 0 1 3-7 9 9 0 0 1 7 3l-3 3a9 9 0 0 1-7-3 9 9 0 0 1-3 7z" />
    <path d="m16 5 3 3" />
  </>
);

export const PieChartIcon = createIcon(
  "PieChartIcon",
  <>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </>
);

export const ClockIcon = createIcon(
  "ClockIcon",
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
);

export const TrendingDownIcon = createIcon(
  "TrendingDownIcon",
  <>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </>
);

export const SmileIcon = createIcon(
  "SmileIcon",
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </>
);

export const WalletIcon = createIcon(
  "WalletIcon",
  <>
    <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4Z" />
    <path d="M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6" />
    <path d="M18 12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z" />
  </>
);

export const ScaleIcon = createIcon(
  "ScaleIcon",
  <>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </>
);

export const SettingsIcon = createIcon(
  "SettingsIcon",
  <>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const CreditCardIcon = createIcon(
  "CreditCardIcon",
  <>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </>
);

export const LogOutIcon = createIcon(
  "LogOutIcon",
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </>
);

export const SunIcon = createIcon(
  "SunIcon",
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </>
);

export const MoonIcon = createIcon(
  "MoonIcon",
  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
);

export const LaptopIcon = createIcon(
  "LaptopIcon",
  <>
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-.98-1.45L4 16" />
  </>
);

export const MessageSquareIcon = createIcon(
  "MessageSquareIcon",
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
);

export const FileTextIcon = createIcon(
  "FileTextIcon",
  <>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </>
);

export const Trash2Icon = createIcon(
  "Trash2Icon",
  <>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>
);

export const CodeIcon = createIcon(
  "CodeIcon",
  <>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </>
);

export const ClipboardIcon = createIcon(
  "ClipboardIcon",
  <>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </>
);

export const CheckIcon = createIcon(
  "CheckIcon",
  <path d="M20 6 9 17l-5-5" />
);

export const ShoppingCartIcon = createIcon(
  "ShoppingCartIcon",
  <>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </>
);

export const PackageIcon = createIcon(
  "PackageIcon",
  <>
    <path d="M16.5 9.4a4.5 4.5 0 1 1-9 0" />
    <path d="M12 14.5a10 10 0 0 1-10-9.8A10 10 0 0 1 12 2a10 10 0 0 1 10 9.8 10 10 0 0 1-10 9.7Z" />
    <path d="m12 14.5-4-2" />
    <path d="m12 14.5 4-2" />
  </>
);

export const TagIcon = createIcon(
  "TagIcon",
  <>
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0L22 13.41a1 1 0 0 0 0-1.41z" />
    <path d="M7 7h.01" />
  </>
);

export const SendIcon = createIcon(
  "SendIcon",
  <>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </>
);

export const ThumbsUpIcon = createIcon(
  "ThumbsUpIcon",
  <>
    <path d="M7 10v12" />
    <path d="M18.5 10h-5.72a2.3 2.3 0 0 0-2.18 1.5l-2.6 6.5c-.1.2-.1.4-.1.6 0 .5.4 1 1 1h8.5c.6 0 1-.4 1-1l2-8.2c.1-.5 0-1-.5-1.3-.5-.4-1-.5-1.5-.5Z" />
  </>
);

export const ThumbsDownIcon = createIcon(
  "ThumbsDownIcon",
  <>
    <path d="M17 14V2" />
    <path d="M5.5 14h5.72a2.3 2.3 0 0 0 2.18-1.5l2.6-6.5c.1-.2.1-.4.1-.6 0-.5-.4-1-1-1h-8.5c-.6 0-1 .4-1 1l-2 8.2c-.1.5 0 1 .5 1.3.5.4 1 .5 1.5.5Z" />
  </>
);

export const Volume2Icon = createIcon(
  "Volume2Icon",
  <>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </>
);

export const ShareIcon = createIcon(
  "ShareIcon",
  <>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </>
);

export const RefreshCwIcon = createIcon(
  "RefreshCwIcon",
  <>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </>
);

export const PaperclipIcon = createIcon(
  "PaperclipIcon",
  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
);

export const Maximize2Icon = createIcon(
  "Maximize2Icon",
  <>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </>
);

export const MinusIcon = createIcon(
  "MinusIcon",
  <line x1="5" y1="12" x2="19" y2="12" />
);

export const BookmarkIcon = createIcon(
  "BookmarkIcon",
  <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
);

export const ArrowUpDownIcon = createIcon(
  "ArrowUpDownIcon",
  <>
    <path d="m21 16-4 4-4-4" />
    <path d="M17 20V4" />
    <path d="m3 8 4-4 4 4" />
    <path d="M7 4v16" />
  </>
);

export const UserPlusIcon = createIcon(
  "UserPlusIcon",
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </>
);

export const HashIcon = createIcon(
  "HashIcon",
  <>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </>
);

export const LockIcon = createIcon(
  "LockIcon",
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>
);

export const GitBranchIcon = createIcon(
  "GitBranchIcon",
  <>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </>
);

export const ArrowUpIcon = createIcon(
  "ArrowUpIcon",
  <>
    <path d="M12 5l0 14" />
    <path d="M18 11l-6-6-6 6" />
  </>
);

export const ArrowDownIcon = createIcon(
  "ArrowDownIcon",
  <>
    <path d="M12 5l0 14" />
    <path d="M18 13l-6 6-6-6" />
  </>
);

export const ChartBarIcon = createIcon(
  "ChartBarIcon",
  <>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </>
);

export const WifiIcon = createIcon(
  "WifiIcon",
  <>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </>
);

export const LightningBoltIcon = createIcon(
  "LightningBoltIcon",
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
);

// ---------------------------------------------------------------------------
// Usage examples (delete if you prefer a clean file):
// <InfoIcon className="text-muted-foreground" title="Info" />
// <LineChartIcon size={20} strokeWidth={1.5} />
// <MoebiusIcon fill="currentColor" stroke="none" />
// ---------------------------------------------------------------------------
