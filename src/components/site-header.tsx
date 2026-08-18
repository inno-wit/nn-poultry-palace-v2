"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavKey = "Home" | "Products" | "Inside" | "About";

const NAV_LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "Home", label: "Home", href: "/" },
  { key: "Products", label: "Products", href: "/products" },
  { key: "Inside", label: "Inside the Farm", href: "/inside-the-farm" },
  { key: "About", label: "About", href: "/about" },
];

const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "FAQ", href: "/faq" },
  { label: "Inside the Farm", href: "/inside-the-farm" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const FAQ_PEEK_VISIBLE_MS = 4200;
const FAQ_PEEK_GAP_MS = 5000;
const FAQ_PEEK_TAB_HEIGHT = 34;

export function SiteHeader() {
  const pathname = usePathname();
  const variant: "solid" | "image" = pathname === "/" ? "image" : "solid";
  const active: NavKey | undefined = pathname === "/"
    ? "Home"
    : pathname?.startsWith("/products")
      ? "Products"
      : pathname?.startsWith("/about")
        ? "About"
        : pathname?.startsWith("/inside-the-farm")
          ? "Inside"
          : undefined;
  const [scrolled, setScrolled] = useState(false);
  const [faqPeekEligible, setFaqPeekEligible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqPeekVisible, setFaqPeekVisible] = useState(false);
  const spacerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Separate, much larger threshold than `scrolled` (which only drives the header's own
  // compact styling at 80px). The FAQ peek needs the hero well out of the way first, or it
  // ends up overlapping hero copy the moment the header merely goes compact.
  useEffect(() => {
    const onScroll = () => setFaqPeekEligible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (variant === "image") return;
    const el = headerRef.current;
    const spacer = spacerRef.current;
    if (!el || !spacer) return;
    spacer.style.height = `${el.offsetHeight}px`;
  }, [scrolled, isMobile, variant]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Desktop-only: FAQ tab peeks at the far right end, below the navbar, then retracts and
  // waits before peeking again. Fixed position now (no per-link measurement needed) — the
  // loop only runs once the user has scrolled well past the hero (faqPeekEligible), and
  // stops the moment the user scrolls back up.
  useEffect(() => {
    if (isMobile || !faqPeekEligible) {
      setFaqPeekVisible(false);
      return;
    }
    let cancelled = false;
    let timer: number;

    const cycle = () => {
      setFaqPeekVisible(true);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setFaqPeekVisible(false);
        timer = window.setTimeout(() => {
          if (cancelled) return;
          cycle();
        }, FAQ_PEEK_GAP_MS);
      }, FAQ_PEEK_VISIBLE_MS);
    };

    timer = window.setTimeout(cycle, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isMobile, faqPeekEligible]);

  const light = variant === "image" && !scrolled;
  const ink = light ? "rgba(245,240,232,.85)" : "#111111";
  const paddingY = scrolled ? 13 : variant === "image" ? 26 : 22;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[80]"
        style={{
          background: light ? "transparent" : "var(--color-cream)",
          borderBottom: `1px solid ${light ? "transparent" : "rgba(17,17,17,.16)"}`,
          transition: "background .5s var(--ease-editorial), padding .5s var(--ease-editorial), border-color .5s var(--ease-editorial)",
          padding: `${paddingY}px clamp(20px, 4vw, 56px)`,
        }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-8"
          style={{ maxWidth: "var(--container-site)" }}
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/nn-logo-mark.png"
              alt="N&N Poultry Palace"
              width={4501}
              height={2251}
              style={{ height: 70, width: "auto" }}
              priority
            />
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-8 text-[15px] font-medium transition-colors duration-500" style={{ color: ink }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ color: active === link.key ? "#c0613b" : undefined }}
                  className="nn-navlink hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-5">
            {!isMobile && (
              <span
                className="font-mono text-[10px] tracking-[.2em] uppercase transition-colors duration-500"
                style={{ color: light ? "rgba(245,240,232,.55)" : "rgba(17,17,17,.5)" }}
              >
                Machakos, KE
              </span>
            )}
            <Link
              href="/order"
              className="nn-arrow text-dark font-semibold whitespace-nowrap"
              style={{
                padding: isMobile ? "9px 13px" : "14px 24px",
                fontSize: isMobile ? 11 : 15,
                backgroundImage: "linear-gradient(to right, var(--color-gold), var(--color-orange))",
              }}
            >
              Order Fresh Eggs <span>→</span>
            </Link>
            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                className="font-mono text-[11px] tracking-[.2em] uppercase bg-transparent border-0 cursor-pointer"
                style={{ color: ink }}
              >
                Menu
              </button>
            )}
          </div>
        </div>

        {!isMobile && (
          // Clipping "pocket" — the tab slides vertically inside this window, so retracting
          // reads as being swallowed back up rather than fading out as an overlay. Fixed at
          // the far right end, just below the navbar's own bottom border. Gated on
          // `faqPeekEligible`: the peek only runs once the user has scrolled well past the
          // hero (see the loop effect above), never over a transparent, just-loaded, or
          // barely-scrolled header where it would overlap hero content.
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: "clamp(20px, 4vw, 56px)",
              height: FAQ_PEEK_TAB_HEIGHT,
              overflow: "hidden",
              pointerEvents: faqPeekVisible && faqPeekEligible ? "auto" : "none",
              zIndex: 5,
            }}
          >
            <Link
              href="/faq"
              aria-hidden={!(faqPeekVisible && faqPeekEligible)}
              tabIndex={faqPeekVisible && faqPeekEligible ? 0 : -1}
              className="font-mono uppercase flex items-center justify-center"
              style={{
                // Retract past -100%: at exactly -100% the pill's rounded bottom edge lands
                // flush on the clip boundary and leaves a hairline sliver visible. The extra
                // 8px pushes it fully clear.
                transform: `translateY(${faqPeekVisible && faqPeekEligible ? "0px" : `calc(-100% - 8px)`})`,
                transition: "transform .5s var(--ease-editorial)",
                background: "var(--color-terracotta)",
                color: "var(--color-cream)",
                fontSize: 11,
                letterSpacing: ".14em",
                fontWeight: 700,
                padding: "8px 16px 9px",
                borderRadius: "0 0 10px 10px",
                whiteSpace: "nowrap",
              }}
            >
              FAQ
            </Link>
          </div>
        )}
      </header>
      {variant !== "image" && <div ref={spacerRef} />}

      {/* Mobile floating FAQ bubble */}
      {isMobile && (
        <Link
          href="/faq"
          aria-label="Frequently asked questions"
          className="fixed flex items-center justify-center font-bold"
          style={{
            bottom: 22,
            right: 18,
            width: 54,
            height: 54,
            borderRadius: "50%",
            backgroundImage: "linear-gradient(135deg, var(--color-gold), var(--color-orange))",
            color: "var(--color-dark)",
            fontSize: 12,
            letterSpacing: "-.01em",
            boxShadow: "0 10px 24px rgba(17,17,17,.28)",
            zIndex: 70,
          }}
        >
          FAQ
        </Link>
      )}

      {/* Mobile full-screen menu */}
      <div
        className="fixed inset-0 z-[90] bg-dark flex flex-col justify-between gap-10 overflow-y-auto"
        style={{
          padding: "28px 24px 40px",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity .5s var(--ease-editorial)",
        }}
      >
        <div className="flex justify-between items-center">
          <span className="font-mono text-[11px] tracking-[.2em] uppercase text-cream/50">Machakos, KE</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="bg-transparent border-0 text-cream font-mono text-[11px] tracking-[.2em] uppercase cursor-pointer py-2"
          >
            Close
          </button>
        </div>
        <nav className="flex flex-col gap-1.5">
          {MENU_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="nn-menu-link text-cream font-bold tracking-tight leading-[1.15]"
              style={{ fontSize: "clamp(30px, 8vh, 56px)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <span className="w-[7px] h-[7px] rounded-full bg-status-on nn-status-dot" />
            <span className="font-mono text-[11px] tracking-[.16em] uppercase text-cream/60">
              Eggs, manure &amp; hens available
            </span>
          </div>
          <Link
            href="/order"
            onClick={() => setMenuOpen(false)}
            className="nn-arrow text-dark justify-between px-[26px] py-[22px] text-[18px] font-semibold"
            style={{ backgroundImage: "linear-gradient(to right, var(--color-gold), var(--color-orange))" }}
          >
            Order Fresh Eggs <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
