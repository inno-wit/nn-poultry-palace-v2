"use client";

import { useEffect, useState } from "react";
import { EASE_EDITORIAL, prefersReducedMotion } from "@/lib/motion";

export type RotatorQuote = {
  quote: string;
  name: string;
  place?: string;
  role?: string;
};

/** How long a quote holds the headline slot before the row steps again. */
const HOLD_MS = 5200;
/** Length of the step itself. */
const SLIDE_MS = 900;

type Props = {
  featured: RotatorQuote;
  others: RotatorQuote[];
};

/**
 * Section 07. The short quotes queue left one column at a time; whichever leaves
 * the left edge is promoted into the headline slot, and the outgoing headline
 * rejoins the queue at the right, so every testimonial comes around again.
 */
export function TestimonialRotator({ featured, others }: Props) {
  const quotes = [featured, ...others];
  const [cycle, setCycle] = useState(() => quotes.map((_, i) => i));
  const [phase, setPhase] = useState<"hold" | "slide">("hold");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (quotes.length < 2) return;

    if (phase === "slide") {
      // An in-flight step always finishes, so pausing mid-slide can't strand the track
      const id = window.setTimeout(() => {
        setCycle((c) => [...c.slice(1), c[0]]);
        setPhase("hold");
      }, SLIDE_MS);
      return () => {
        window.clearTimeout(id);
      };
    }

    if (paused || prefersReducedMotion()) return;
    const id = window.setTimeout(() => {
      setPhase("slide");
    }, HOLD_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [phase, cycle, paused, quotes.length]);

  const fade = `opacity .8s ${EASE_EDITORIAL}, transform .8s ${EASE_EDITORIAL}`;
  const layer = (on: boolean, y: number) => ({
    gridArea: "1 / 1",
    // Block is sized to the longest quote; shorter ones sit down against the rule
    alignSelf: "end" as const,
    opacity: on ? 1 : 0,
    transform: on ? "none" : `translateY(${String(y)}px)`,
    transition: fade,
    pointerEvents: on ? ("auto" as const) : ("none" as const),
  });

  // The outgoing headline waits at the right-hand end, ready to slide back into view
  const queue = [...cycle.slice(1), cycle[0]];
  // Hand the headline over as the step runs, so the quote rises out of the left edge
  // at the same moment the outgoing one re-enters the row on the right
  const headline = phase === "slide" ? cycle[1] : cycle[0];

  const promote = (position: number) => {
    if (phase === "slide") return;
    setCycle((c) => {
      const k = (position + 1) % c.length;
      return [...c.slice(k), ...c.slice(0, k)];
    });
  };

  const pauseHandlers = {
    onMouseEnter: () => {
      setPaused(true);
    },
    onMouseLeave: () => {
      setPaused(false);
    },
    onFocusCapture: () => {
      setPaused(true);
    },
    onBlurCapture: () => {
      setPaused(false);
    },
  };

  return (
    <>
      <div className="col-span-12 md:col-span-8 md:col-start-3" {...pauseHandlers}>
        {/* Every quote shares one grid cell, so the block is sized to the longest and never jumps */}
        <div style={{ display: "grid" }} aria-live="polite">
          {quotes.map((q, i) => (
            <blockquote
              key={q.name}
              aria-hidden={i === headline ? undefined : true}
              style={{
                ...layer(i === headline, 18),
                margin: "0 0 40px",
                fontSize: "clamp(28px, 3.8vw, 58px)",
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: "-.032em",
                textWrap: "pretty",
              }}
            >
              &ldquo;{q.quote}&rdquo;
            </blockquote>
          ))}
        </div>

        <div style={{ display: "grid", borderTop: "1px solid rgba(17,17,17,.28)", paddingTop: 22 }}>
          {quotes.map((q, i) => (
            <div
              key={q.name}
              aria-hidden={i === headline ? undefined : true}
              className="flex flex-wrap items-baseline gap-5"
              style={layer(i === headline, 10)}
            >
              <span style={{ fontSize: 19, fontWeight: 600 }}>{q.name}</span>
              <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".18em", color: "rgba(17,17,17,.6)" }}>
                {q.place}
                {q.role ? ` · ${q.role}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="nn-queue col-span-12"
        style={
          {
            marginTop: "clamp(48px, 6vw, 80px)",
            // Always keep at least one quote waiting off the right edge
            "--nn-queue-max": Math.max(1, quotes.length - 1),
          } as React.CSSProperties
        }
        {...pauseHandlers}
      >
        <div className={`nn-queue-track${phase === "slide" ? " is-stepping" : ""}`}>
          {queue.map((qi, position) => {
            const q = quotes[qi];
            return (
              <button
                key={q.name}
                type="button"
                aria-label={`Read the full quote from ${q.name}`}
                onClick={() => {
                  promote(position);
                }}
              >
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(17,17,17,.78)", margin: "0 0 12px" }}>
                  &ldquo;{q.quote}&rdquo;
                </p>
                <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".16em", color: "rgba(17,17,17,.55)" }}>
                  {q.name}
                  {q.place ? ` · ${q.place}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
