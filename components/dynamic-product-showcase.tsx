"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/* =========================
   Config
========================= */
const ORBIT_SECONDS = 18;        // speed of the circular orbit (boxes)
const FRAME_INTERVAL_MS = 4000;  // how often to swap to the next metrics frame

/* =========================
   Types
========================= */
interface MetricBox {
  id: string;
  label: string;
  value: string;
  icon?: "up" | "down" | "neutral";
  angle: number;    // degrees around the circle
  radius: number;   // px from center
  scale?: number;   // 0.8 to 1.2
  sparkline?: number[];
  marketplace?: "US" | "EU" | "CA";
  subtext?: string;
}

interface ProductSlide {
  id: string;
  name: string;
  image: string;
  metrics?: MetricBox[][];
}

/* =========================
   Data (unchanged from yours)
========================= */
const slides: ProductSlide[] = [
  {
    id: "1",
    name: "Running Shoes",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71eqRkYOS3L._AC_SY695_-removebg-preview-ZCvUFWfUluUWnJ3nNu5D5HWKbpT5Gq.png",
    metrics: [
      [
        {
          id: "1a",
          label: "CTR",
          value: "2.7%",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [2.1, 2.3, 2.4, 2.5, 2.6, 2.7],
          marketplace: "US",
          subtext: "↑ 0.4% vs last week",
        },
        {
          id: "1b",
          label: "ACoS",
          value: "18.1%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [22, 21, 20, 19.5, 19, 18.1],
          marketplace: "EU",
          subtext: "↓ 3.9% improvement",
        },
        {
          id: "1c",
          label: "ROAS",
          value: "4.5×",
          icon: "up",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [3.5, 3.8, 4.0, 4.2, 4.3, 4.5],
          marketplace: "CA",
          subtext: "+1.0 this month",
        },
        {
          id: "1d",
          label: "Ad Spend",
          value: "$428",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [320, 350, 380, 400, 415, 428],
          marketplace: "US",
          subtext: "Daily average",
        },
      ],
      [
        {
          id: "2a",
          label: "Conversion Rate",
          value: "12.3%",
          icon: "up",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [9.5, 10.2, 10.8, 11.5, 12.0, 12.3],
          marketplace: "US",
          subtext: "↑ 2.8% vs last week",
        },
        {
          id: "2b",
          label: "CTR",
          value: "3.1%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [2.5, 2.7, 2.8, 2.9, 3.0, 3.1],
          marketplace: "EU",
          subtext: "Above category avg",
        },
        {
          id: "2c",
          label: "ACoS",
          value: "14.7%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [18, 17, 16, 15.5, 15, 14.7],
          marketplace: "CA",
          subtext: "Target: 15%",
        },
        {
          id: "2d",
          label: "ROAS",
          value: "5.2×",
          icon: "up",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [4.2, 4.5, 4.7, 4.9, 5.0, 5.2],
          marketplace: "US",
          subtext: "Strong performance",
        },
      ],
      [
        {
          id: "3a",
          label: "Ad Spend",
          value: "$512",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [380, 420, 450, 480, 495, 512],
          marketplace: "US",
          subtext: "Daily budget",
        },
        {
          id: "3b",
          label: "Conversion Rate",
          value: "15.8%",
          icon: "up",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [12, 13, 14, 14.5, 15, 15.8],
          marketplace: "EU",
          subtext: "Peak performance",
        },
        {
          id: "3c",
          label: "CTR",
          value: "2.9%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [2.3, 2.5, 2.6, 2.7, 2.8, 2.9],
          marketplace: "CA",
          subtext: "Steady growth",
        },
        {
          id: "3d",
          label: "ACoS",
          value: "16.5%",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [19, 18.5, 18, 17.5, 17, 16.5],
          marketplace: "US",
          subtext: "Optimizing",
        },
      ],
    ],
  },
  {
    id: "2",
    name: "Studio Speakers",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/51odD6JDkML._AC_SL1080_-removebg-preview-BQ3nQUVNUymggwvBlXbXXskJ0EMQLt.png",
    metrics: [
      [
        {
          id: "4a",
          label: "CTR",
          value: "3.4%",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [2.8, 3.0, 3.1, 3.2, 3.3, 3.4],
          marketplace: "US",
          subtext: "↑ 0.6% vs last week",
        },
        {
          id: "4b",
          label: "ACoS",
          value: "12.9%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [16, 15, 14, 13.5, 13, 12.9],
          marketplace: "EU",
          subtext: "↓ 3.1% improvement",
        },
        {
          id: "4c",
          label: "ROAS",
          value: "6.1×",
          icon: "up",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [4.8, 5.2, 5.5, 5.8, 6.0, 6.1],
          marketplace: "CA",
          subtext: "+1.3 this month",
        },
        {
          id: "4d",
          label: "Ad Spend",
          value: "$685",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [520, 560, 600, 640, 665, 685],
          marketplace: "US",
          subtext: "Daily average",
        },
      ],
      [
        {
          id: "5a",
          label: "Conversion Rate",
          value: "14.2%",
          icon: "up",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [11, 11.8, 12.5, 13.2, 13.8, 14.2],
          marketplace: "US",
          subtext: "↑ 3.2% vs last week",
        },
        {
          id: "5b",
          label: "CTR",
          value: "3.8%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [3.0, 3.2, 3.4, 3.5, 3.7, 3.8],
          marketplace: "EU",
          subtext: "Above category avg",
        },
        {
          id: "5c",
          label: "ACoS",
          value: "11.4%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [15, 14, 13, 12.5, 12, 11.4],
          marketplace: "CA",
          subtext: "Target: 12%",
        },
        {
          id: "5d",
          label: "ROAS",
          value: "7.2×",
          icon: "up",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [5.5, 6.0, 6.4, 6.8, 7.0, 7.2],
          marketplace: "US",
          subtext: "Excellent performance",
        },
      ],
      [
        {
          id: "6a",
          label: "Ad Spend",
          value: "$742",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [580, 620, 660, 700, 720, 742],
          marketplace: "US",
          subtext: "Daily budget",
        },
        {
          id: "6b",
          label: "Conversion Rate",
          value: "16.5%",
          icon: "up",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [13, 14, 14.8, 15.5, 16, 16.5],
          marketplace: "EU",
          subtext: "Peak performance",
        },
        {
          id: "6c",
          label: "CTR",
          value: "4.1%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [3.2, 3.5, 3.7, 3.9, 4.0, 4.1],
          marketplace: "CA",
          subtext: "Strong growth",
        },
        {
          id: "6d",
          label: "ACoS",
          value: "10.8%",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [14, 13, 12.5, 12, 11.5, 10.8],
          marketplace: "US",
          subtext: "Highly optimized",
        },
      ],
    ],
  },
  {
    id: "3",
    name: "Car Jump Starter",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71fQI6aWUyL._AC_SL1500_-removebg-preview-GRc3mBDXBfh3RhSgDZNa2myJ8jLqht.png",
    metrics: [
      [
        {
          id: "7a",
          label: "CTR",
          value: "2.4%",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [1.9, 2.0, 2.1, 2.2, 2.3, 2.4],
          marketplace: "US",
          subtext: "↑ 0.5% vs last week",
        },
        {
          id: "7b",
          label: "ACoS",
          value: "19.3%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [24, 23, 22, 21, 20, 19.3],
          marketplace: "EU",
          subtext: "↓ 4.7% improvement",
        },
        {
          id: "7c",
          label: "ROAS",
          value: "3.9×",
          icon: "up",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [3.0, 3.3, 3.5, 3.7, 3.8, 3.9],
          marketplace: "CA",
          subtext: "+0.9 this month",
        },
        {
          id: "7d",
          label: "Ad Spend",
          value: "$395",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [280, 310, 340, 365, 380, 395],
          marketplace: "US",
          subtext: "Daily average",
        },
      ],
      [
        {
          id: "8a",
          label: "Conversion Rate",
          value: "10.7%",
          icon: "up",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [8.2, 8.8, 9.4, 10.0, 10.4, 10.7],
          marketplace: "US",
          subtext: "↑ 2.5% vs last week",
        },
        {
          id: "8b",
          label: "CTR",
          value: "2.8%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [2.2, 2.4, 2.5, 2.6, 2.7, 2.8],
          marketplace: "EU",
          subtext: "Above category avg",
        },
        {
          id: "8c",
          label: "ACoS",
          value: "17.6%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [21, 20, 19, 18.5, 18, 17.6],
          marketplace: "CA",
          subtext: "Target: 18%",
        },
        {
          id: "8d",
          label: "ROAS",
          value: "4.3×",
          icon: "up",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [3.5, 3.7, 3.9, 4.0, 4.2, 4.3],
          marketplace: "US",
          subtext: "Good performance",
        },
      ],
      [
        {
          id: "9a",
          label: "Ad Spend",
          value: "$458",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [340, 370, 400, 425, 440, 458],
          marketplace: "US",
          subtext: "Daily budget",
        },
        {
          id: "9b",
          label: "Conversion Rate",
          value: "13.1%",
          icon: "up",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [10, 11, 11.5, 12, 12.5, 13.1],
          marketplace: "EU",
          subtext: "Strong performance",
        },
        {
          id: "9c",
          label: "CTR",
          value: "3.2%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [2.5, 2.7, 2.8, 3.0, 3.1, 3.2],
          marketplace: "CA",
          subtext: "Steady growth",
        },
        {
          id: "9d",
          label: "ACoS",
          value: "15.9%",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [19, 18.5, 18, 17.5, 17, 15.9],
          marketplace: "US",
          subtext: "Optimizing well",
        },
      ],
    ],
  },
  {
    id: "4",
    name: "Pet Bed",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/81CHV8%2Bx1cL._AC_SL1500_-removebg-preview-x0dELNPA3y39G8ujW472M8VUxrutq4.png",
    metrics: [
      [
        {
          id: "10a",
          label: "CTR",
          value: "3.6%",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [2.9, 3.1, 3.2, 3.4, 3.5, 3.6],
          marketplace: "US",
          subtext: "↑ 0.7% vs last week",
        },
        {
          id: "10b",
          label: "ACoS",
          value: "13.2%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [17, 16, 15, 14.5, 14, 13.2],
          marketplace: "EU",
          subtext: "↓ 3.8% improvement",
        },
        {
          id: "10c",
          label: "ROAS",
          value: "5.8×",
          icon: "up",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [4.5, 4.9, 5.2, 5.4, 5.6, 5.8],
          marketplace: "CA",
          subtext: "+1.3 this month",
        },
        {
          id: "10d",
          label: "Ad Spend",
          value: "$562",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [420, 460, 490, 520, 540, 562],
          marketplace: "US",
          subtext: "Daily average",
        },
      ],
      [
        {
          id: "11a",
          label: "Conversion Rate",
          value: "15.4%",
          icon: "up",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [12, 13, 13.8, 14.5, 15, 15.4],
          marketplace: "US",
          subtext: "↑ 3.4% vs last week",
        },
        {
          id: "11b",
          label: "CTR",
          value: "4.2%",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [3.4, 3.6, 3.8, 4.0, 4.1, 4.2],
          marketplace: "EU",
          subtext: "Above category avg",
        },
        {
          id: "11c",
          label: "ACoS",
          value: "11.8%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [15, 14, 13, 12.5, 12, 11.8],
          marketplace: "CA",
          subtext: "Target: 12%",
        },
        {
          id: "11d",
          label: "ROAS",
          value: "6.5×",
          icon: "up",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [5.0, 5.5, 5.8, 6.0, 6.2, 6.5],
          marketplace: "US",
          subtext: "Excellent performance",
        },
      ],
      [
        {
          id: "12a",
          label: "Ad Spend",
          value: "$628",
          angle: 135,
          radius: 340,
          scale: 1.0,
          sparkline: [480, 520, 560, 590, 610, 628],
          marketplace: "US",
          subtext: "Daily budget",
        },
        {
          id: "12b",
          label: "Conversion Rate",
          value: "17.2%",
          icon: "up",
          angle: 45,
          radius: 340,
          scale: 1.0,
          sparkline: [14, 15, 15.8, 16.5, 17, 17.2],
          marketplace: "EU",
          subtext: "Peak performance",
        },
        {
          id: "12c",
          label: "CTR",
          value: "4.5%",
          angle: 225,
          radius: 340,
          scale: 1.0,
          sparkline: [3.6, 3.9, 4.1, 4.3, 4.4, 4.5],
          marketplace: "CA",
          subtext: "Strong growth",
        },
        {
          id: "12d",
          label: "ACoS",
          value: "10.3%",
          angle: 315,
          radius: 340,
          scale: 1.0,
          sparkline: [14, 13, 12.5, 12, 11.5, 10.3],
          marketplace: "US",
          subtext: "Highly optimized",
        },
      ],
    ],
  },
];

/* =========================
   Small UI helpers
========================= */
function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 40;
      const y = 16 - ((v - min) / range) * 12;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="40" height="16" className="opacity-60">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MarketplaceBadge({ marketplace }: { marketplace: "US" | "EU" | "CA" }) {
  const flags = { US: "🇺🇸", EU: "🇪🇺", CA: "🇨🇦" };
  return (
    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
      <span>{flags[marketplace]}</span>
      <span>{marketplace}</span>
    </div>
  );
}

/* =========================
   Component
========================= */
export function DynamicProductShowcase() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);

  // rotate products every 12s (kept)
  useEffect(() => {
    const productInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentProductIndex((prev) => (prev + 1) % slides.length);
        setFrameIndex(0); // reset frames on product change
        setIsVisible(true);
      }, 300);
    }, 12000);
    return () => clearInterval(productInterval);
  }, []);

  // cycle metric frames every 4s
  useEffect(() => {
    const n = slides[currentProductIndex].metrics?.length ?? 1;
    if (n <= 1) return;
    const t = setInterval(() => setFrameIndex((i) => (i + 1) % n), FRAME_INTERVAL_MS);
    return () => clearInterval(t);
  }, [currentProductIndex]);

  const currentSlide = slides[currentProductIndex];
  const currentMetrics = currentSlide.metrics ? currentSlide.metrics[frameIndex] : [];

  // push boxes slightly out on small screens to keep product visible
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1440;
  const radiusFactor = viewportW < 640 ? 0.88 : viewportW > 1400 ? 1.05 : 1.0;

  return (
    <div className="relative flex h-[600px] w-full items-center justify-center">

      {/* soft glow rings */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-[400px] w-[400px] rounded-full bg-gradient-radial from-[var(--brand-green)]/40 via-[var(--brand-green)]/15 to-transparent blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="h-[350px] w-[350px] rounded-full border border-[var(--brand-green)]/20 bg-gradient-radial from-[var(--brand-green)]/30 via-[var(--brand-green)]/10 to-transparent blur-2xl" />
      </motion.div>

      {/* product */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <motion.div
              className="relative h-[320px] w-[320px]" // a touch larger for visibility
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={currentSlide.image || "/placeholder.svg"}
                alt={currentSlide.name}
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.12))" }}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* orbiting metric cards */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: "linear" }}
      >
        <AnimatePresence mode="wait">
          {currentMetrics.map((metric, index) => {
            const angleRad = (metric.angle * Math.PI) / 180;
            const r = (metric.radius || 340) * radiusFactor;
            const x = Math.cos(angleRad) * r;
            const y = Math.sin(angleRad) * r;

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: metric.scale || 1, y: [0, -4, 0] }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
                }}
                className="absolute z-20"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                {/* counter-rotate so text stays upright */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div
                    className="group relative rounded-xl border border-white/40 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md hover:shadow-xl transition-shadow min-w-[180px]"
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    {metric.marketplace && (
                      <div className="mb-2">
                        <MarketplaceBadge marketplace={metric.marketplace} />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                        <p className="mt-0.5 text-lg font-bold text-foreground">{metric.value}</p>
                        {metric.subtext && (
                          <p className="mt-1 text-[10px] text-muted-foreground">{metric.subtext}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {metric.icon === "up" && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                        {metric.icon === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                        {metric.icon === "neutral" && <Minus className="h-4 w-4 text-gray-600" />}
                        {metric.sparkline && (
                          <div className="text-emerald-600">
                            <MiniSparkline data={metric.sparkline} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
