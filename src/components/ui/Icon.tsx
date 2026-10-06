import {
  ArrowRight,
  BadgeCheck,
  BatteryFull,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CloudOff,
  CloudUpload,
  Cpu,
  Flame,
  HardDrive,
  Lock,
  LockOpen,
  LogOut,
  MapPin,
  Menu,
  MemoryStick,
  MessageCircle,
  Monitor,
  Package,
  Plus,
  Recycle,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  TriangleAlert,
  Truck,
  Wallet,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Inline SVG icons (lucide). Replaces the Material Symbols web font, which was
 * render-blocking and briefly showed ligature names ("arrow_forward") while
 * loading. Unknown names render nothing instead of raw text.
 */
const icons = {
  add: Plus,
  arrow: ArrowRight,
  battery: BatteryFull,
  check: CircleCheck,
  "check-plain": Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  close: X,
  "cloud-off": CloudOff,
  "cloud-upload": CloudUpload,
  cpu: Cpu,
  deal: Tag,
  flame: Flame,
  lock: Lock,
  "lock-open": LockOpen,
  logout: LogOut,
  memory: MemoryStick,
  menu: Menu,
  chat: MessageCircle,
  pin: MapPin,
  package: Package,
  recycle: Recycle,
  screen: Monitor,
  settings: Settings,
  shield: ShieldCheck,
  sparkles: Sparkles,
  storage: HardDrive,
  store: Store,
  truck: Truck,
  verified: BadgeCheck,
  wallet: Wallet,
  warning: TriangleAlert,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: IconName | (string & {});
  className?: string;
  strokeWidth?: number;
}) {
  const Component = (icons as Record<string, LucideIcon>)[name];
  if (!Component) return null;
  return <Component aria-hidden focusable={false} strokeWidth={strokeWidth} className={cn("size-[1.15em] shrink-0", className)} />;
}

/** WhatsApp glyph (brand mark, not part of lucide). */
export function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 24 24" fill="currentColor" className={cn("size-[1.15em] shrink-0", className)}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.44 9.44 0 0 1-1.45-5.04c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.92.99 6.71 2.79a9.43 9.43 0 0 1 2.78 6.71c0 5.23-4.26 9.49-9.49 9.49m8.08-17.57A11.35 11.35 0 0 0 12.05.58C5.75.58.63 5.7.63 12c0 2.01.53 3.98 1.53 5.71L.54 23.42l5.85-1.53a11.4 11.4 0 0 0 5.65 1.44h.01c6.3 0 11.42-5.12 11.42-11.42 0-3.05-1.19-5.92-3.34-8.08" />
    </svg>
  );
}
