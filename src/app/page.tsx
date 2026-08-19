import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/home/hero";
import { HomeProductChapter } from "@/components/home/product-chapter";
import { TestimonialRotator } from "@/components/home/testimonial-rotator";
import { Reveal } from "@/components/motion/reveal";
import { SectionEyebrow } from "@/components/ui/eyebrow";
import { ArrowButton } from "@/components/ui/arrow-button";
import { ZoomImage } from "@/components/ui/zoom-image";
import { deliveryZones } from "@/lib/site-data";
import { MobileProcessDna } from "@/components/home/mobile-process-dna";
import { client } from "@/sanity/lib/client";
import { TESTIMONIALS_QUERY } from "@/sanity/lib/queries";

type TestimonialDoc = {
  _id: string;
  name: string;
  place?: string;
  role?: string;
  quote: string;
  featured?: boolean;
};

const PROCESS_STEPS = [
  { n: "01", title: "Care", body: "A walk-through of the flock before anything else. You learn to read a bird." },
  { n: "02", title: "Collect", body: "Three times a day at peak. Frequency is what keeps eggs clean and uncracked." },
  { n: "03", title: "Grade", body: "Shell integrity and size consistency, checked by hand between two and four." },
  { n: "04", title: "Pack", body: "Sealed into 30pc trays by five, labelled with the day they were collected." },
  { n: "05", title: "Deliver", body: "On the morning route, Monday to Saturday, across six zones of the county." },
];


const FALLBACK_TESTIMONIALS = {
  featured: {
    quote:
      "We switched our restaurant supply to N&N six months ago. Their wholesale pricing is fair, invoicing is professional, and I have never had a rejected batch.",
    name: "Chef Kamau J.",
    place: "Machakos Town",
    role: "Restaurant owner",
  },
  grid: [
    { quote: "The yolks are bright and rich — you can really taste the difference.", name: "Wanjiru M.", place: "Syokimau" },
    { quote: "WhatsApp ordering is convenient, and they remind me before I run low.", name: "Amina S.", place: "Athi River" },
    { quote: "Supply chain reliability is everything. N&N delivers on time, every time.", name: "David K.", place: "Mlolongo" },
    { quote: "Their manure is rich and well-composted — my soil health improved in one season.", name: "Sarah L.", place: "Katoloni" },
  ],
};

const ARTICLES = [
  {
    slug: "chicks-feeding",
    src: "/assets/education/chicks-feeding.jpeg",
    alt: "Chicks feeding",
    category: "The Chick Journey",
    title: "The Science of Chick Feeding",
    span: "md:col-span-6",
    aspect: "4/3",
    titleSize: "clamp(22px, 2.2vw, 32px)",
  },
  {
    slug: "poultry-manure-benefits",
    src: "/assets/education/poultry-manure.png",
    alt: "Poultry manure",
    category: "Product Excellence",
    title: "Sustainable Farming with Organic Manure",
    span: "md:col-span-3",
    aspect: "4/5",
    titleSize: "20px",
  },
  {
    slug: "enhanced-biosecurity",
    src: "/images/biosecurity.jpeg",
    alt: "Biosecurity",
    category: "Growth & Care",
    title: "Controlled Access for Enhanced Biosecurity",
    span: "md:col-span-3",
    aspect: "4/5",
    titleSize: "20px",
  },
];

export default async function HomePage() {
  const testimonials = await client
    .fetch<TestimonialDoc[]>(TESTIMONIALS_QUERY, {}, { next: { revalidate: 300 } })
    .catch(() => [] as TestimonialDoc[]);
  const featured = testimonials.find((t) => t.featured) ?? FALLBACK_TESTIMONIALS.featured;
  const grid = testimonials.length
    ? testimonials.filter((t) => !t.featured)
    : FALLBACK_TESTIMONIALS.grid;

  return (
    <>
      <HomeHero />

      {/* 01 The Farm intro strip */}
      <Reveal as="section" style={{ background: "var(--color-cream)", padding: "clamp(88px, 12vw, 190px) clamp(20px, 4vw, 56px) clamp(56px, 7vw, 96px)" }}>
        <div className="grid grid-cols-12 gap-8 items-start" style={{ maxWidth: "var(--container-site)", margin: "0 auto" }}>
          <div className="col-span-12 md:col-span-2 font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".2em", color: "rgba(17,17,17,.45)", lineHeight: 2 }}>
            The Farm
            <br />
            <span style={{ color: "var(--color-terracotta)" }}>Machakos</span>
            <br />
            Daily care
          </div>
          <h2
            className="col-span-12 md:col-span-9 md:col-start-3"
            style={{ margin: 0, fontSize: "clamp(36px, 5.6vw, 84px)", fontWeight: 700, lineHeight: 0.98, letterSpacing: "-.035em", textWrap: "pretty" }}
          >
            Every product begins with how we care for the flock.
          </h2>
        </div>
      </Reveal>

      {/* 02 Operations — day in numbers */}
      <section style={{ background: "var(--color-dark)", color: "var(--color-cream)", padding: "clamp(80px, 10vw, 150px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ maxWidth: "var(--container-site)", margin: "0 auto" }}>
          <div className="grid grid-cols-12" style={{ gap: "clamp(28px, 4vw, 56px)", alignItems: "stretch" }}>
            <div className="col-span-12 md:col-span-7">
              <Reveal style={{ marginBottom: "clamp(40px, 5vw, 72px)" }}>
                <SectionEyebrow color="var(--color-gold)">Operations</SectionEyebrow>
                <h2 style={{ margin: "18px 0 0", fontSize: "clamp(32px, 4.4vw, 62px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-.03em" }}>
                  The day, in numbers.
                </h2>
                <p style={{ margin: "20px 0 0", fontSize: 19, lineHeight: 1.6, color: "rgba(245,240,232,.6)", maxWidth: "46ch" }}>
                  Nothing here is a marketing figure. These are the times we work to and the window we hold ourselves to.
                </p>
              </Reveal>

              <Reveal style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid rgba(245,240,232,.18)" }}>
                {[
                  { n: "2 PM", label: "Collection starts", body: "Hens lay from dawn to past midday. Grading runs two until four." },
                  { n: "5 PM", label: "Packed & sealed", body: "Shell-checked by hand. Anything that fails is ours to absorb." },
                  { n: "24–48", label: "Hours, farm to door", body: "Yesterday's collection goes to the local market, never into tomorrow's tray." },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      borderRight: i % 2 === 0 ? "1px solid rgba(245,240,232,.18)" : undefined,
                      borderBottom: "1px solid rgba(245,240,232,.18)",
                      padding: `28px ${i % 2 === 0 ? "24px" : "0"} 28px ${i % 2 === 0 ? "0" : "24px"}`,
                    }}
                  >
                    <div style={{ fontSize: "clamp(40px, 4vw, 60px)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1, color: "var(--color-gold)" }}>
                      {stat.n}
                    </div>
                    <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(245,240,232,.5)", marginTop: 14 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(245,240,232,.55)", marginTop: 10, maxWidth: "30ch" }}>
                      {stat.body}
                    </div>
                  </div>
                ))}
                <div style={{ padding: "28px 0 28px 24px" }}>
                  <div style={{ fontSize: "clamp(40px, 4vw, 60px)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1, color: "var(--color-gold)" }}>
                    06
                  </div>
                  <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(245,240,232,.5)", marginTop: 14 }}>
                    Delivery zones
                  </div>
                  <div className="flex flex-wrap gap-2" style={{ marginTop: 12 }}>
                    {deliveryZones.map((zone) => (
                      <span
                        key={zone}
                        className="font-mono uppercase"
                        style={{ fontSize: 10, letterSpacing: ".12em", color: "rgba(245,240,232,.6)", border: "1px solid rgba(245,240,232,.2)", padding: "5px 9px" }}
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "28px 0 28px 24px" }} />
              </Reveal>
            </div>

            <div className="col-span-12 md:col-span-5 relative" style={{ minHeight: "clamp(320px, 40vw, 560px)" }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/farm-loop-poster.png"
                aria-label="Walking the layer house at N&N Poultry Palace"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source src="/farm-loop.mp4" type="video/mp4" />
              </video>
              <div
                className="absolute"
                style={{
                  left: "clamp(16px, 2.4vw, 28px)",
                  bottom: "clamp(16px, 2.4vw, 28px)",
                  background: "rgba(17,17,17,.9)",
                  padding: "14px 20px",
                  maxWidth: 320,
                }}
              >
                <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: ".2em", color: "var(--color-gold)", marginBottom: 6 }}>
                  Layer house — Katoloni
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(245,240,232,.78)" }}>
                  A walk-through before anyone checks a phone in the morning.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Products intro */}
      <section style={{ background: "var(--color-cream)", padding: "clamp(88px, 11vw, 170px) 0 0" }}>
        <Reveal className="grid grid-cols-12 gap-8" style={{ padding: "0 clamp(20px, 4vw, 56px) clamp(48px, 6vw, 80px)", maxWidth: "var(--container-site)", margin: "0 auto" }}>
          <div className="col-span-12 md:col-span-2">
            <SectionEyebrow>Products</SectionEyebrow>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-3">
            <h2 style={{ margin: "0 0 20px", fontSize: "clamp(32px, 4.4vw, 62px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-.03em" }}>
              Three things. Each done properly.
            </h2>
            <p style={{ margin: 0, fontSize: 19, lineHeight: 1.6, color: "rgba(17,17,17,.66)", maxWidth: "46ch" }}>
              The flock produces eggs, the barn produces manure, and at the end of the laying cycle the hens themselves. Nothing on this farm is wasted.
            </p>
          </div>
        </Reveal>

        <HomeProductChapter
          eyebrowLabel="Table Eggs"
          eyebrowColor="var(--color-gold)"
          heading={<>Fresh eggs,<br />collected daily.</>}
          body="Sold by the thirty-piece tray. Mixed grade, large and medium, inspected for shell integrity and size before packing."
          metaRows={[
            { label: "Collection", value: "Daily, from 2 PM" },
            { label: "Unit", value: "30pc tray / bulk case" },
            { label: "Best for", value: "Households · Bakeries · Kiosks" },
          ]}
          ctaLabel="Order Table Eggs"
          ctaHref="/products#table-eggs"
          image="/eggs.jpeg"
          imageAlt="Trays of fresh N&N table eggs"
          imageSide="right"
        />

        <HomeProductChapter
          eyebrowLabel="Poultry Manure"
          eyebrowColor="var(--color-sage)"
          heading={<>What the barn<br />gives the soil.</>}
          body="Nothing added, nothing treated. Dried naturally in the Machakos sun, which concentrates the nutrients and clears most pathogens."
          metaRows={[
            { label: "Composition", value: "Nitrogen · Phosphorus · Potassium" },
            { label: "Unit", value: "70kg sack / FH truck" },
            { label: "Coverage", value: "≈50–80 m² per sack" },
          ]}
          ctaLabel="Order Manure"
          ctaHref="/products#poultry-manure"
          image="/manure-hips.jpeg"
          imageAlt="Poultry manure heaps drying in the sun"
          imageSide="left"
          background="rgba(122,158,126,.09)"
        />

        <HomeProductChapter
          eyebrowLabel="Ex-Layer Hens"
          eyebrowColor="var(--color-terracotta)"
          heading={<>The end of<br />a good cycle.</>}
          body="Healthy birds at 72–80 weeks, vet-inspected and raised on balanced feed. Firm meat, favoured for slow-cooked traditional dishes."
          metaRows={[
            { label: "Age", value: "72–80 weeks" },
            { label: "Health", value: "Full vaccination programme" },
            { label: "Collection", value: "Sold live, at the farm" },
          ]}
          ctaLabel="Enquire on Hens"
          ctaHref="/products#ex-layer-hens"
          image="/layers.jpeg"
          imageAlt="Ex-layer hens at N&N Poultry Palace"
          imageSide="right"
        />
      </section>

      {/* 04 Process strip */}
      <section style={{ background: "var(--color-dark)", color: "var(--color-cream)", padding: "clamp(80px, 10vw, 150px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ maxWidth: "var(--container-site)", margin: "0 auto" }}>
          <div className="grid grid-cols-12 gap-8" style={{ marginBottom: "clamp(48px, 6vw, 88px)" }}>
            <div className="col-span-12 md:col-span-2">
              <SectionEyebrow color="var(--color-gold)">Process</SectionEyebrow>
            </div>
            <h2
              className="col-span-12 md:col-span-7 md:col-start-3"
              style={{ margin: 0, fontSize: "clamp(32px, 4.4vw, 62px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-.03em" }}
            >
              Care, collect, grade,
              <br />
              pack, deliver.
            </h2>
          </div>
          {/* Mobile Scroll-linked DNA Helix view */}
          <div className="block md:hidden border-t border-white/10 pt-8">
            <MobileProcessDna steps={PROCESS_STEPS} />
          </div>

          {/* Desktop structured horizontal process strip */}
          <div className="hidden md:block">
            <Reveal style={{ display: "grid", borderTop: "1px solid rgba(245,240,232,.18)" }} className="md:!grid-cols-5">
              {PROCESS_STEPS.map((step, i) => (
                <div
                  key={step.n}
                  style={{
                    borderRight: i < PROCESS_STEPS.length - 1 ? "1px solid rgba(245,240,232,.18)" : undefined,
                    padding: `34px ${i === PROCESS_STEPS.length - 1 ? 0 : 22}px 40px ${i === 0 ? 0 : 22}px`,
                  }}
                >
                  <div className="font-mono" style={{ fontSize: 11, letterSpacing: ".2em", color: "var(--color-gold)", marginBottom: 22 }}>
                    {step.n}
                  </div>
                  <div style={{ fontSize: "clamp(20px, 1.7vw, 26px)", fontWeight: 600, letterSpacing: "-.015em", marginBottom: 14 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(245,240,232,.55)" }}>{step.body}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 Founder quote */}
      <Reveal
        as="section"
        style={{ background: "var(--color-dark)", color: "var(--color-cream)", padding: "0 clamp(20px, 4vw, 56px)" }}
      >
      <div
        className="grid grid-cols-12 items-center"
        style={{ gap: "clamp(24px, 4vw, 64px)", maxWidth: "var(--container-site)", margin: "0 auto" }}
      >
        <div className="col-span-12 md:col-span-5 self-stretch relative" style={{ minHeight: "clamp(360px, 46vw, 700px)" }}>
          <ZoomImage
            src="/farm-sign.jpeg"
            alt="The N&N Poultry Farm entrance sign"
            className="absolute inset-0"
            sizes="(max-width: 900px) 100vw, 42vw"
          />
          <div
            className="absolute left-0 right-0 bottom-0 font-mono uppercase"
            style={{ background: "rgba(17,17,17,.88)", padding: "14px 20px", fontSize: 10, letterSpacing: ".16em", color: "rgba(245,240,232,.6)" }}
          >
            Founder portrait to be photographed — flock imagery standing in
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7" style={{ padding: "clamp(64px, 8vw, 130px) 0" }}>
          <div className="flex items-center gap-3.5" style={{ marginBottom: 30 }}>
            <span style={{ width: 34, height: 1, background: "var(--color-gold)", display: "inline-block" }} />
            <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".18em", color: "var(--color-gold)" }}>
              The people behind it
            </span>
          </div>
          <blockquote
            style={{ margin: "0 0 36px", fontSize: "clamp(28px, 3.4vw, 50px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-.03em" }}
          >
            “Integrity, teamwork and consistency are our guiding principles.”
          </blockquote>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(245,240,232,.62)", maxWidth: "52ch", marginBottom: 18 }}>
            N&amp;N began in 2021 as a backyard broiler project during Covid. When the eateries closed and the broiler market went with them, the family moved to layers in 2022 and registered the company. Disease challenges came next, and with them online training, seminars and a long run of farm visits.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(245,240,232,.62)", maxWidth: "52ch", marginBottom: 40 }}>
            The name comes from a family setup — two daughters bear the initials. The first year was hard. Batches were lost, mistakes were made. The quality of what left the farm never moved.
          </p>
          <div style={{ borderTop: "1px solid rgba(245,240,232,.2)", paddingTop: 22 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>The Kyalos</div>
            <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".16em", color: "var(--color-gold)", marginTop: 6 }}>
              Founders &amp; Directors · 5 years farming
            </div>
          </div>
        </div>
      </div>
      </Reveal>

      {/* 06 Testimonials */}
      <section style={{ background: "var(--color-gold)", padding: "clamp(80px, 10vw, 160px) clamp(20px, 4vw, 56px)" }}>
        <div className="grid grid-cols-12 gap-8" style={{ maxWidth: "var(--container-site)", margin: "0 auto" }}>
          <div className="col-span-12 md:col-span-2">
            <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".2em", color: "rgba(17,17,17,.55)" }}>
              Trust
            </span>
          </div>
          <TestimonialRotator featured={featured} others={grid} />
        </div>
      </section>

      {/* 07 Education teaser */}
      <section style={{ background: "var(--color-cream)", padding: "clamp(80px, 10vw, 160px) clamp(20px, 4vw, 56px)" }}>
        <div style={{ maxWidth: "var(--container-site)", margin: "0 auto" }}>
          <Reveal className="grid grid-cols-12 gap-8 items-end" style={{ marginBottom: "clamp(40px, 5vw, 72px)" }}>
            <div className="col-span-6 md:col-span-2">
              <SectionEyebrow>Education</SectionEyebrow>
            </div>
            <h2
              className="col-span-12 md:col-span-6 md:col-start-3"
              style={{ margin: 0, fontSize: "clamp(30px, 3.8vw, 56px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-.03em" }}
            >
              Inside the Farm
            </h2>
            <div className="col-span-6 md:col-span-2 md:col-start-11 md:justify-self-end">
              <Link
                href="/inside-the-farm"
                className="font-mono uppercase"
                style={{ fontSize: 11, letterSpacing: ".18em", color: "var(--color-terracotta)", borderBottom: "1px solid rgba(192,97,59,.4)", paddingBottom: 6 }}
              >
                All writing →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-12" style={{ gap: "clamp(20px, 3vw, 40px)" }}>
            {ARTICLES.map((a) => (
              <Link key={a.title} href={`/inside-the-farm#${a.slug}`} className={`nn-hoverzoom col-span-12 ${a.span} block`}>
                <div className="relative" style={{ aspectRatio: a.aspect }}>
                  <Image src={a.src} alt={a.alt} fill sizes="50vw" style={{ objectFit: "cover" }} />
                </div>
                <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: ".18em", color: "var(--color-terracotta)", margin: "18px 0 10px" }}>
                  {a.category}
                </div>
                <div style={{ fontSize: a.titleSize, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.15 }}>{a.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: "var(--color-dark)", color: "var(--color-cream)", padding: "clamp(90px, 12vw, 180px) clamp(20px, 4vw, 56px)" }}>
        <div className="grid grid-cols-12 gap-8 items-end" style={{ maxWidth: "var(--container-site)", margin: "0 auto" }}>
          <div className="col-span-12 md:col-span-7">
            <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--color-gold)", display: "block", marginBottom: 30 }}>
              Order
            </span>
            <h2 style={{ margin: "0 0 28px", fontSize: "clamp(38px, 6vw, 92px)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-.038em" }}>
              Send a message.
              <br />
              Eat tomorrow.
            </h2>
            <p style={{ fontSize: 20, lineHeight: 1.6, color: "rgba(245,240,232,.65)", maxWidth: "44ch" }}>
              Tell us the quantity and where you are. We confirm price and the next delivery slot, usually within minutes.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-4">
            <ArrowButton href="/order" variant="primary" size="lg">Order Fresh Eggs</ArrowButton>
            <ArrowButton href="/contact" variant="secondary" size="lg" onDark>Talk to us</ArrowButton>
            <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(245,240,232,.45)", lineHeight: 2, marginTop: 8 }}>
              0113 377 623 · 0714 246 534
              <br />
              Mon–Fri 8–5 · Sat 8–12
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
