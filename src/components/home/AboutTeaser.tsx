import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** "Sobre nosotros" preview on the home, linking to the full /nosotros page. */
export function AboutTeaser() {
  const { promise, about } = siteConfig;

  return (
    <section aria-labelledby="nosotros-title" className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-6">
        <h2 id="nosotros-title" className="text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]">
          Reacondicionadas profesionalmente, <span className="text-primary">con todo funcional</span>
        </h2>
        <p className="text-lg leading-relaxed text-on-surface-variant">{about.intro}</p>
        <blockquote className="border-l-2 border-primary pl-5 text-lg font-medium leading-relaxed text-on-surface">
          {promise.body}
        </blockquote>
        <Link href="/nosotros" className={buttonClasses({ variant: "outline", size: "md", className: "min-h-12" })}>
          Conoce más sobre nosotros <Icon name="arrow" />
        </Link>
      </div>

      <ol className="glass divide-y divide-white/10 rounded-[2rem] px-6 md:px-8">
        {about.process.map((step, index) => (
          <li key={step.title} className="flex gap-5 py-6">
            <span className="font-display text-sm font-bold tabular-nums text-primary">0{index + 1}</span>
            <div>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-1 leading-relaxed text-on-surface-variant">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
