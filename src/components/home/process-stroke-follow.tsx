"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionEyebrow } from "@/components/ui/eyebrow";

export interface ProcessStep {
  n: string;
  title: string;
  body: string;
  detail?: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    n: "01",
    title: "Care",
    body: "A walk-through of the flock before anything else. You learn to read a bird.",
    detail: "6:00 AM — First house inspection before morning feeding.",
  },
  {
    n: "02",
    title: "Collect",
    body: "Three times a day at peak. Frequency is what keeps eggs clean and uncracked.",
    detail: "10:00 AM & 2:00 PM — Gentle hand-collection into cushioned trays.",
  },
  {
    n: "03",
    title: "Grade",
    body: "Shell integrity and size consistency, checked by hand between two and four.",
    detail: "2:00 PM - 4:00 PM — Candling and weight classification.",
  },
  {
    n: "04",
    title: "Pack",
    body: "Sealed into 30pc trays by five, labelled with the day they were collected.",
    detail: "5:00 PM — Food-grade carton sealing with collection date stamp.",
  },
  {
    n: "05",
    title: "Deliver",
    body: "On the morning route, Monday to Saturday, across six zones of the county.",
    detail: "Next Day 7:00 AM — Climate-safe doorstep delivery in Machakos.",
  },
];

const SVG_ENTANGLED_PATH =
  "M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89";

export function ProcessStrokeFollow({
  steps = DEFAULT_STEPS,
}: {
  steps?: ProcessStep[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 80%"],
  });

  // Animated stroke drawing mapped to scroll progress (entanglement loops fully present from start)
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.46, 1]);
  const strokeDashoffset = useTransform(pathLength, (value) => 1 - value);

  return (
    <section
      ref={containerRef}
      id="farm-process"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-cream)",
        color: "var(--color-dark)",
        padding: "clamp(48px, 5vw, 72px) clamp(20px, 4vw, 56px) clamp(60px, 6vw, 90px)",
      }}
    >
      <div
        className="mx-auto relative z-10"
        style={{ maxWidth: "var(--container-site)" }}
      >
        {/* Desktop Layout: Header with Entangled Loops focused directly behind and around 'Care, collect, grade, pack, deliver' */}
        <div className="relative hidden md:block" style={{ minHeight: 1600 }}>
          {/* Continuous Organic SVG Follow Stroke positioned from the very top of the section */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1278 2800"
              fill="none"
              overflow="visible"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Navbar CTA Button Gradient (Gold -> Orange -> Terracotta) */}
                <linearGradient
                  id="navbarCtaStrokeGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ECCC74" />
                  <stop offset="50%" stopColor="#F59268" />
                  <stop offset="100%" stopColor="#C0613B" />
                </linearGradient>

                {/* Translucent Background Guide */}
                <linearGradient
                  id="navbarCtaGuideGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ECCC74" stopOpacity="0.22" />
                  <stop offset="50%" stopColor="#F59268" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#C0613B" stopOpacity="0.22" />
                </linearGradient>
              </defs>

              {/* Guide Track */}
              <path
                d={SVG_ENTANGLED_PATH}
                stroke="url(#navbarCtaGuideGrad)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic Scroll Progress Stroke */}
              <motion.path
                d={SVG_ENTANGLED_PATH}
                stroke="url(#navbarCtaStrokeGrad)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  pathLength,
                  strokeDashoffset,
                  filter: "drop-shadow(0 4px 16px rgba(245, 146, 104, 0.4))",
                }}
              />
            </svg>
          </div>

          {/* Section Header: Entanglement loops sit intertwined behind this headline */}
          <div className="relative z-10 pt-2 mb-12">
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12 md:col-span-3">
                <SectionEyebrow color="var(--color-terracotta)">
                  Daily Standards
                </SectionEyebrow>
              </div>
              <div className="col-span-12 md:col-span-9">
                <h2
                  style={{
                    margin: 0,
                    fontSize: "clamp(34px, 4.2vw, 56px)",
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-.032em",
                  }}
                >
                  Care, collect, grade,
                  <br />
                  pack, deliver.
                </h2>
                <p
                  style={{
                    margin: "18px 0 0",
                    fontSize: "clamp(15px, 1.2vw, 18px)",
                    lineHeight: 1.6,
                    color: "rgba(17,17,17,0.78)",
                    maxWidth: "52ch",
                  }}
                >
                  Every single egg follows this unbroken five-stage protocol from morning inspection to county-wide doorstep dispatch.
                </p>
              </div>
            </div>
          </div>

          {/* Step 01: Care (Pocket: upper right descent pocket right below entanglement) */}
          <StepRevealItem
            step={steps[0]}
            scrollYProgress={scrollYProgress}
            startTrigger={0.02}
            activeTrigger={0.12}
            positionStyle={{
              position: "absolute",
              top: "340px",
              left: "48%",
              maxWidth: "380px",
            }}
          />

          {/* Step 02: Collect (Pocket: left arc cradle) */}
          <StepRevealItem
            step={steps[1]}
            scrollYProgress={scrollYProgress}
            startTrigger={0.18}
            activeTrigger={0.28}
            positionStyle={{
              position: "absolute",
              top: "610px",
              left: "8%",
              maxWidth: "360px",
            }}
          />

          {/* Step 03: Grade (Pocket: center/right pocket above horizontal curve) */}
          <StepRevealItem
            step={steps[2]}
            scrollYProgress={scrollYProgress}
            startTrigger={0.36}
            activeTrigger={0.46}
            positionStyle={{
              position: "absolute",
              top: "840px",
              left: "40%",
              maxWidth: "380px",
            }}
          />

          {/* Step 04: Pack (Pocket: upper right loop) */}
          <StepRevealItem
            step={steps[3]}
            scrollYProgress={scrollYProgress}
            startTrigger={0.56}
            activeTrigger={0.66}
            positionStyle={{
              position: "absolute",
              top: "1060px",
              left: "58%",
              maxWidth: "370px",
            }}
          />

          {/* Step 05: Deliver (Pocket: lower left final descent sweep) */}
          <StepRevealItem
            step={steps[4]}
            scrollYProgress={scrollYProgress}
            startTrigger={0.74}
            activeTrigger={0.86}
            positionStyle={{
              position: "absolute",
              top: "1320px",
              left: "30%",
              maxWidth: "380px",
            }}
          />
        </div>

        {/* Mobile & Small Screens Layout */}
        <div className="relative block md:hidden" style={{ minHeight: 1150 }}>
          {/* Mobile Header */}
          <div className="relative z-10 mb-8 pt-2">
            <SectionEyebrow color="var(--color-terracotta)">
              Daily Standards
            </SectionEyebrow>
            <h2 className="text-3xl font-bold tracking-tight text-dark mt-2 leading-tight">
              Care, collect, grade,
              <br />
              pack, deliver.
            </h2>
            <p className="mt-3 text-sm text-dark/75 leading-relaxed">
              Every single egg follows this unbroken five-stage protocol from morning inspection to county-wide doorstep dispatch.
            </p>
          </div>

          {/* Mobile SVG Stroke with Gradient */}
          <div className="absolute top-[140px] left-0 right-0 bottom-0 pointer-events-none z-0">
            <svg
              viewBox="0 0 400 1200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="mobileCtaStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ECCC74" />
                  <stop offset="50%" stopColor="#F59268" />
                  <stop offset="100%" stopColor="#C0613B" />
                </linearGradient>
                <linearGradient id="mobileCtaGuideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ECCC74" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#F59268" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#C0613B" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              <path
                d="M 320 20 C 360 80, 240 120, 290 170 C 340 220, 80 200, 50 300 C 20 400, 360 440, 340 580 C 320 720, 60 740, 40 880 C 20 1020, 350 1050, 310 1200"
                stroke="url(#mobileCtaGuideGrad)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <motion.path
                d="M 320 20 C 360 80, 240 120, 290 170 C 340 220, 80 200, 50 300 C 20 400, 360 440, 340 580 C 320 720, 60 740, 40 880 C 20 1020, 350 1050, 310 1200"
                stroke="url(#mobileCtaStrokeGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                style={{
                  pathLength,
                  filter: "drop-shadow(0 2px 8px rgba(245, 146, 104, 0.35))",
                }}
              />
            </svg>
          </div>

          <div className="relative z-10 space-y-16 pt-4 px-2">
            {steps.map((step, idx) => {
              const startTrigger = idx * 0.18 + 0.02;
              const activeTrigger = startTrigger + 0.12;

              return (
                <MobileStepRevealItem
                  key={step.n}
                  step={step}
                  scrollYProgress={scrollYProgress}
                  startTrigger={startTrigger}
                  activeTrigger={activeTrigger}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepRevealItem({
  step,
  scrollYProgress,
  startTrigger,
  activeTrigger,
  positionStyle,
}: {
  step: ProcessStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollYProgress: any;
  startTrigger: number;
  activeTrigger: number;
  positionStyle: React.CSSProperties;
}) {
  // Appears strictly when the progress stroke reaches its pocket/position
  const opacity = useTransform(
    scrollYProgress,
    [startTrigger, activeTrigger],
    [0, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [startTrigger, activeTrigger],
    [16, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [startTrigger, activeTrigger],
    [0.96, 1]
  );

  return (
    <motion.div
      style={{
        ...positionStyle,
        opacity,
        y,
        scale,
      }}
      className="z-10 select-none pointer-events-auto"
    >
      {/* Step Index Number */}
      <div className="font-mono text-xs lg:text-sm font-semibold tracking-[0.2em] text-[#C0613B] uppercase mb-1">
        {step.n}
      </div>

      {/* Step Title */}
      <h3 className="text-3xl lg:text-[38px] font-bold tracking-tight text-dark mb-2 leading-[1.1]">
        {step.title}
      </h3>

      {/* Step Body */}
      <p className="text-base lg:text-[18px] text-dark/80 leading-[1.5] font-normal">
        {step.body}
      </p>

      {/* Detail Timestamp */}
      {step.detail && (
        <div className="mt-2 text-xs lg:text-xs font-mono text-dark/50 tracking-wider uppercase">
          {step.detail}
        </div>
      )}
    </motion.div>
  );
}

function MobileStepRevealItem({
  step,
  scrollYProgress,
  startTrigger,
  activeTrigger,
}: {
  step: ProcessStep;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollYProgress: any;
  startTrigger: number;
  activeTrigger: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [startTrigger, activeTrigger],
    [0, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [startTrigger, activeTrigger],
    [14, 0]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative z-10 pl-6 pr-2"
    >
      <div className="font-mono text-xs font-semibold tracking-[0.2em] text-[#C0613B] uppercase mb-1">
        {step.n}
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-dark mb-1.5">
        {step.title}
      </h3>
      <p className="text-sm text-dark/80 leading-relaxed">
        {step.body}
      </p>
      {step.detail && (
        <div className="mt-1.5 text-[11px] font-mono text-dark/50 tracking-wider uppercase">
          {step.detail}
        </div>
      )}
    </motion.div>
  );
}
