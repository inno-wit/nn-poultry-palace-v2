"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowButton } from "@/components/ui/arrow-button";
import { StatusDot } from "@/components/ui/status-dot";
import { Container } from "@/components/ui/container";
import { useNairobiTime } from "@/components/ui/use-nairobi-time";
import { prefersReducedMotion } from "@/lib/motion";

export function HomeHero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const time = useNairobiTime();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = imgRef.current;
    if (!el) return;
    const amt = 24;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (window.innerWidth < 900) return;
        const prog = window.scrollY / window.innerHeight;
        el.style.transform = `translate3d(0, ${(prog * amt).toFixed(2)}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100vh", background: "var(--color-dark)" }}
    >
      <div ref={imgRef} className="absolute" style={{ inset: "-34px 0" }}>
        <Image
          src="/assets/education/grading-of-eggs.jpeg"
          alt="Stacking trays of graded eggs at the N&N farm"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "62% 50%",
            animation: "nn-hero-settle 2.4s var(--ease-editorial) both",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(17,17,17,.9) 0%, rgba(17,17,17,.62) 44%, rgba(17,17,17,.12) 78%, rgba(17,17,17,.3) 100%)",
          }}
        />
      </div>

      <div
        className="relative grid grid-cols-12 gap-8"
        style={{ padding: "200px clamp(20px, 4vw, 56px) 0", alignContent: "center", flex: 1, maxWidth: "var(--container-site)", margin: "0 auto", width: "100%" }}
      >
        <div className="col-span-12 md:col-span-7">
          <div className="nn-hero-in flex items-center gap-3.5" style={{ marginBottom: 34, animationDelay: ".2s" }}>
            <span style={{ width: 44, height: 1, background: "var(--color-gold)", display: "inline-block" }} />
            <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".24em", color: "var(--color-gold)" }}>
              Machakos / Kenya
            </span>
          </div>
          <h1
            className="nn-hero-in"
            style={{
              margin: 0,
              fontSize: "clamp(52px, 8.4vw, 122px)",
              fontWeight: 800,
              lineHeight: 0.87,
              letterSpacing: "-.038em",
              color: "var(--color-cream)",
              animationDelay: ".34s",
            }}
          >
            From our flock
            <br />
            to your table.
          </h1>
          <p
            className="nn-hero-in"
            style={{
              marginTop: 34,
              maxWidth: "44ch",
              fontSize: "clamp(18px, 1.5vw, 22px)",
              lineHeight: 1.55,
              color: "rgba(245,240,232,.72)",
              animationDelay: ".48s",
            }}
          >
            Eggs laid here, graded here, dispatched from here. No cold storage, no middlemen — a
            family farm in Machakos County that has been getting the ordinary thing right since
            2021.
          </p>
          <div className="nn-hero-in flex flex-wrap gap-4" style={{ marginTop: 44, animationDelay: ".62s" }}>
            <ArrowButton href="/order" variant="primary" size="hero">
              Order Fresh Eggs
            </ArrowButton>
            <ArrowButton href="/inside-the-farm" variant="secondary" size="hero" onDark>
              Explore the Farm
            </ArrowButton>
          </div>
        </div>
      </div>

      <div
        className="nn-hero-in relative"
        style={{
          borderTop: "1px solid rgba(245,240,232,.16)",
          background: "rgba(17,17,17,.55)",
          animationDelay: ".8s",
        }}
      >
        <Container
          className="flex flex-wrap items-center justify-between"
          style={{ padding: "22px clamp(20px, 4vw, 56px)", gap: "14px 44px" }}
        >
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: ".24em", color: "var(--color-gold)" }}>
            Farm Status
          </span>
          <div className="flex flex-wrap items-center" style={{ gap: "14px 36px" }}>
            {[
              { label: "Table eggs — Available", delay: "0s" },
              { label: "Manure — Available", delay: ".4s" },
              { label: "Ex-layers — Available", delay: ".8s" },
            ].map((item) => (
              <span
                key={item.label}
                className="font-mono uppercase inline-flex items-center gap-2.5"
                style={{ fontSize: 11, letterSpacing: ".16em", color: "rgba(245,240,232,.8)" }}
              >
                <StatusDot delay={item.delay} />
                {item.label}
              </span>
            ))}
          </div>
          <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: ".18em", color: "rgba(245,240,232,.45)" }}>
            {time ? `Updated ${time} EAT` : " "}
          </span>
        </Container>
      </div>
    </section>
  );
}
