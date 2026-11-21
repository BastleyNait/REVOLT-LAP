"use client";

import { useEffect, useState } from "react";

const fmt = () =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Lima" }).format(new Date());

/** Today's date in Lima, computed in the browser: the page itself is static. */
export function TodayDate() {
  const [date, setDate] = useState<string | null>(null);
  useEffect(() => setDate(fmt()), []);
  return <span suppressHydrationWarning>{date ?? " "}</span>;
}
