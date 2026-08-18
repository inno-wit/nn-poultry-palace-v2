import Link from "next/link";
import { business } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="bg-dark-deep text-cream/60" style={{ padding: "clamp(56px, 7vw, 96px) clamp(20px, 4vw, 56px) 40px" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--container-site)" }}>
        <div className="grid grid-cols-12 gap-8 pb-14 border-b border-cream/14">
          <div className="col-span-12 md:col-span-4">
            <div className="text-[22px] font-bold text-cream tracking-tight">{business.name}</div>
            <div className="font-mono text-[11px] tracking-[.18em] uppercase text-gold mt-2.5">
              Fresh and Nutritious
            </div>
            <p className="mt-5 text-[15px] leading-[1.7]" style={{ maxWidth: "34ch" }}>
              {business.vision}
            </p>
          </div>
          <div className="col-span-6 md:col-span-2 text-[15px] leading-[2.2]">
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-cream/40 mb-3.5">Pages</div>
            <Link href="/products" className="block">Products</Link>
            <Link href="/faq" className="block">FAQ</Link>
            <Link href="/about" className="block">About</Link>
            <Link href="/inside-the-farm" className="block">Inside the Farm</Link>
            <Link href="/contact" className="block">Contact</Link>
          </div>
          <div className="col-span-6 md:col-span-2 text-[15px] leading-[2.2]">
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-cream/40 mb-3.5">Products</div>
            <Link href="/products#table-eggs" className="block">Table Eggs</Link>
            <Link href="/products#poultry-manure" className="block">Poultry Manure</Link>
            <Link href="/products#ex-layer-hens" className="block">Ex-Layer Hens</Link>
          </div>
          <div className="col-span-12 md:col-span-4 font-mono text-[12px] leading-[2.2] tracking-[.06em]">
            <div className="text-[10px] tracking-[.2em] uppercase text-cream/40 mb-3.5">Contact</div>
            <div>{business.phonesFormatted.join(" · ")}</div>
            <div>{business.email}</div>
            <div>{business.address}</div>
            <div className="mt-3 text-cream/40">Mon–Fri 8:00–17:00 · Sat 8:00–12:00</div>
          </div>
        </div>
        <div className="flex justify-between flex-wrap gap-4 pt-7 font-mono text-[10px] tracking-[.18em] uppercase text-cream/35">
          <span>© {new Date().getFullYear()} {business.name}</span>
          <span className="flex gap-5 flex-wrap">
            <Link href="/privacy" className="text-cream/55">Privacy Policy</Link>
            <Link href="/terms" className="text-cream/55">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
