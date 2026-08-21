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
    const handleScroll = () => {
      const top =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        window.scrollY ||
        document.body.scrollTop ||
        0;
      setScrolled(top > 15);
      setFaqPeekEligible(top > window.innerHeight * 0.5);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  const ink = light ? "rgba(245,240,232,0.95)" : "#111111";
  const activeColor = light ? "var(--color-gold)" : "var(--color-terracotta)";
  const paddingY = scrolled ? 12 : variant === "image" ? 22 : 18;
  const logoHeight = scrolled ? 48 : 66;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[80]"
        style={{
          background: light ? "transparent" : "rgba(245,240,232,0.96)",
          backdropFilter: light ? "none" : "blur(16px)",
          WebkitBackdropFilter: light ? "none" : "blur(16px)",
          borderBottom: `1px solid ${light ? "transparent" : "rgba(17,17,17,0.14)"}`,
          boxShadow: scrolled ? "0 4px 24px -2px rgba(17,17,17,0.09), 0 2px 6px -1px rgba(17,17,17,0.04)" : "none",
          transition: "background .4s var(--ease-editorial), padding .4s var(--ease-editorial), border-color .4s var(--ease-editorial), box-shadow .4s var(--ease-editorial)",
          padding: `${paddingY}px clamp(20px, 4vw, 56px)`,
        }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-8"
          style={{ maxWidth: "var(--container-site)" }}
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/Aug 19, 2026, 01_271_17 PM.png"
              alt="N&N Poultry Palace"
              width={260}
              height={90}
              style={{
                height: logoHeight,
                width: "auto",
                transition: "height .4s var(--ease-editorial)",
              }}
              priority
            />
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-8 text-[15px] transition-colors duration-400">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color: active === link.key ? activeColor : ink,
                    fontWeight: active === link.key ? 600 : 500,
                  }}
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
                className="font-mono text-[10px] tracking-[.2em] uppercase transition-colors duration-400"
                style={{ color: light ? "rgba(245,240,232,.55)" : "rgba(17,17,17,.5)" }}
              >
                Machakos, KE
              </span>
            )}
            {!isMobile && (
              <Link
                href="/order"
                className="nn-arrow text-dark font-semibold whitespace-nowrap"
                style={{
                  padding: "14px 24px",
                  fontSize: 15,
                  backgroundImage: "linear-gradient(to right, var(--color-gold), var(--color-orange))",
                }}
              >
                Order Fresh Eggs <span>→</span>
              </Link>
            )}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open Menu"
                className="flex items-center justify-center w-11 h-11 bg-transparent border-0 cursor-pointer p-0 -mr-2.5 focus:outline-none"
              >
                <div className="flex flex-col justify-between w-6 h-3.5">
                  <span className="w-full h-[2px] rounded-full transition-all duration-300" style={{ backgroundColor: ink }} />
                  <span className="w-full h-[2px] rounded-full transition-all duration-300" style={{ backgroundColor: ink }} />
                  <span className="w-full h-[2px] rounded-full transition-all duration-300" style={{ backgroundColor: ink }} />
                </div>
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

      {/* Backdrop Dimmer Overlay */}
      <div 
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-xs transition-opacity duration-500"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu (iOS bottom sheet style) */}
      <div
        className="fixed inset-x-0 bottom-0 z-[95] bg-[#141414]/94 backdrop-blur-2xl flex flex-col justify-between border-t border-white/10 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] rounded-t-[28px] overflow-hidden"
        style={{
          height: "calc(100vh - 56px)",
          transform: menuOpen ? "translateY(0)" : "translateY(100%)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "transform 0.5s cubic-bezier(0.32, 0.94, 0.6, 1), opacity 0.4s ease",
          padding: "20px 20px 32px",
        }}
      >
        <div>
          {/* iOS Grab Bar */}
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

          {/* Sheet Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[.2em] uppercase text-cream/40">N&amp;N Poultry Palace</span>
              <span className="font-mono text-[11px] tracking-[.1em] text-cream/60 mt-0.5">Machakos, KE</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/5 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer focus:outline-none"
            >
              <span className="text-[13px] font-semibold">✕</span>
            </button>
          </div>

          {/* Grouped iOS Settings Style Rows */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl divide-y divide-white/[0.06] overflow-hidden mb-6">
            {MENU_LINKS.map((link, idx) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-5 py-4.5 text-white hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-cream/30">0{idx + 1}</span>
                  <span className="text-[17px] font-medium tracking-tight group-hover:text-gold transition-colors">{link.label}</span>
                </div>
                <span className="text-white/30 text-[15px] font-mono group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Area with iOS Call to Action */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5 px-1">
            <span className="w-[7.5px] h-[7.5px] rounded-full bg-status-on nn-status-dot" />
            <span className="font-mono text-[11px] tracking-[.16em] uppercase text-cream/50">
              Eggs, manure &amp; hens available
            </span>
          </div>
          <Link
            href="/order"
            onClick={() => setMenuOpen(false)}
            className="nn-arrow text-dark justify-between px-6 py-4.5 text-[16px] font-semibold rounded-2xl transition-all active:scale-[0.98]"
            style={{ 
              backgroundImage: "linear-gradient(to right, var(--color-gold), var(--color-orange))",
              boxShadow: "0 8px 24px rgba(236,204,116,0.15)"
            }}
          >
            Order Fresh Eggs <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
