"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "@/lib/config/site";
import { generalWhatsappUrl } from "@/lib/services/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils/cn";

const linkBase =
  "font-label-mono text-body-md uppercase font-bold text-on-container px-2 py-1 border-thin border-transparent transition-all";
const linkIdle = "hover:bg-on-background hover:text-surface hover:border-on-background";
const linkHighlight =
  "bg-secondary-container border-thick border-on-background px-4 shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const whatsappHref = generalWhatsappUrl();
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(header.current, { yPercent: -100, autoAlpha: 0, duration: 0.6, ease: "power3.out" });
      },
      header,
    );
    return () => mm.revert();
  }, []);

  return (
    <header
      ref={header}
      className="sticky top-0 z-50 w-full border-b-heavy border-on-background bg-primary-container shadow-neo"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-margin-edge">
        <Link
          href="/"
          className="font-display-lg text-headline-lg-mobile font-black uppercase tracking-tighter text-on-container transition-transform hover:-rotate-2 hover:scale-105"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-gutter md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(linkBase, item.highlight ? linkHighlight : linkIdle)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "secondary", size: "sm", className: "hidden md:inline-flex" })}
          >
            <Icon name="chat" className="text-lg" /> WhatsApp
          </a>
          <Link
            href="/admin"
            className={buttonClasses({ variant: "outline", size: "sm", className: "hidden md:inline-flex" })}
            title="Admin dashboard"
          >
            <Icon name="settings" className="text-lg" />
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={buttonClasses({ variant: "secondary", size: "sm", className: "md:hidden !px-2" })}
          >
            <Icon name={open ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t-thick border-on-background bg-primary-container px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(linkBase, "border-thin border-on-background bg-surface-container-lowest !text-on-background text-center")}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "secondary", size: "md", className: "mt-1 w-full" })}
            >
              <Icon name="chat" /> WhatsApp Us
            </a>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className={buttonClasses({ variant: "outline", size: "md", className: "w-full" })}
            >
              <Icon name="settings" /> Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
