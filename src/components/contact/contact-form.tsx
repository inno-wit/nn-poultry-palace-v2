"use client";

import { useState } from "react";
import { ArrowButton } from "@/components/ui/arrow-button";
import { StatusDot } from "@/components/ui/status-dot";
import { deliveryZones } from "@/lib/site-data";

const PRODUCT_OPTIONS = [
  "Table eggs — 30pc trays",
  "Poultry manure — 70kg sacks",
  "Ex-layer hens",
  "Bulk / wholesale enquiry",
  "Something else",
];

const fieldStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: "12px 0",
  border: 0,
  borderBottom: "1px solid rgba(17,17,17,.28)",
  background: "transparent",
  fontFamily: "inherit",
  fontSize: 19,
  color: "var(--color-dark)",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "rgba(245,240,232,.5)",
};

const errorStyle: React.CSSProperties = {
  display: "block",
  marginTop: 8,
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "var(--color-orange)",
};

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [product, setProduct] = useState(PRODUCT_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; area?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bad = {
      name: !name.trim(),
      phone: !phone.trim(),
      area: !area.trim(),
    };
    setErrors(bad);
    if (bad.name || bad.phone || bad.area) return;
    setSubmitted(true);
  };

  const reset = () => {
    setName("");
    setPhone("");
    setArea("");
    setProduct(PRODUCT_OPTIONS[0]);
    setMessage("");
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div
        style={{
          border: "1px solid rgba(236,204,116,.45)",
          padding: "32px 28px",
          animation: "nn-hero-in .6s var(--ease-editorial) both",
        }}
      >
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <StatusDot />
          <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".2em", color: "var(--color-gold)" }}>
            Message received
          </span>
        </div>
        <div style={{ fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.05, marginBottom: 16 }}>
          Thank you — we&apos;ll reply shortly.
        </div>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(245,240,232,.62)", maxWidth: "44ch", marginBottom: 28 }}>
          During working hours you will usually hear from us within the hour. If you need an answer sooner, WhatsApp is the fastest route.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <ArrowButton href="/order" variant="primary" size="compact">Order on WhatsApp</ArrowButton>
          <button
            type="button"
            onClick={reset}
            className="nn-arrow"
            style={{ border: "1px solid rgba(245,240,232,.3)", color: "var(--color-cream)", padding: "18px 28px", fontSize: 16, fontWeight: 600, background: "none", cursor: "pointer" }}
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 34 }}>
      <div className="grid md:grid-cols-2" style={{ gap: 34 }}>
        <label className="block">
          <span style={labelStyle}>Your name</span>
          <input
            className="nn-input"
            type="text"
            placeholder="Wanjiru M."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setErrors((s) => ({ ...s, name: false }));
            }}
            style={{ ...fieldStyle, borderBottomColor: errors.name ? "var(--color-orange)" : undefined, borderBottomWidth: errors.name ? 2 : 1 }}
          />
          {errors.name && <span style={errorStyle}>We need a name to reply to.</span>}
        </label>
        <label className="block">
          <span style={labelStyle}>Phone</span>
          <input
            className="nn-input"
            type="tel"
            placeholder="07XX XXX XXX"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (e.target.value.trim()) setErrors((s) => ({ ...s, phone: false }));
            }}
            style={{ ...fieldStyle, borderBottomColor: errors.phone ? "var(--color-orange)" : undefined, borderBottomWidth: errors.phone ? 2 : 1 }}
          />
          {errors.phone && <span style={errorStyle}>A number lets us confirm the slot faster.</span>}
        </label>
      </div>

      <div className="grid md:grid-cols-2" style={{ gap: 34 }}>
        <label className="block">
          <span style={labelStyle}>Delivery area</span>
          <select
            className="nn-input"
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              if (e.target.value.trim()) setErrors((s) => ({ ...s, area: false }));
            }}
            style={{ ...fieldStyle, borderBottomColor: errors.area ? "var(--color-orange)" : undefined, borderBottomWidth: errors.area ? 2 : 1 }}
          >
            <option value="">Select an area</option>
            {deliveryZones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
            <option value="Somewhere else">Somewhere else</option>
          </select>
          {errors.area && <span style={errorStyle}>We need an area to quote a delivery slot.</span>}
        </label>
        <label className="block">
          <span style={labelStyle}>What do you need?</span>
          <select className="nn-input" value={product} onChange={(e) => setProduct(e.target.value)} style={fieldStyle}>
            {PRODUCT_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span style={labelStyle}>Message — optional</span>
        <textarea
          className="nn-input"
          rows={3}
          placeholder="Quantity, preferred day, anything else we should know."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={fieldStyle}
        />
      </label>

      <div className="flex items-center flex-wrap gap-4">
        <button
          type="submit"
          className="nn-arrow"
          style={{ backgroundImage: "linear-gradient(to right, var(--color-gold), var(--color-orange))", color: "var(--color-dark)", padding: "18px 30px", fontSize: 16, fontWeight: 600, border: 0, cursor: "pointer" }}
        >
          Send message <span>→</span>
        </button>
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: ".16em", color: "rgba(245,240,232,.4)" }}>
          Prototype — nothing is submitted
        </span>
      </div>
    </form>
  );
}
