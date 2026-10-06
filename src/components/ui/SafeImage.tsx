import Image, { ImageProps } from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/types/product";
import { isAllowedImageHost } from "@/lib/config/image-hosts";

/**
 * Wraps next/image with hostname validation. If the image URL points to an
 * unconfigured host, it renders a placeholder SVG instead of crashing with:
 *   "Invalid src prop on next/image, hostname X is not configured..."
 *
 * This prevents runtime crashes when product images come from external
 * marketplaces or third-party domains not in next.config remotePatterns.
 */
export function SafeImage(props: ImageProps) {
  const originalSrc = props.src;

  // If the src is a string URL, validate the hostname BEFORE passing to <Image>.
  // next/image throws a runtime error during render for unconfigured hosts —
  // this check intercepts that and falls back to a data-URI placeholder.
  let safeSrc: ImageProps["src"] = originalSrc;
  if (typeof originalSrc === "string" && !isAllowedImageHost(originalSrc)) {
    safeSrc = PLACEHOLDER_IMAGE;
  }

  return <Image {...props} src={safeSrc} />;
}
