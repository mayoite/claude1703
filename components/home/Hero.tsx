"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

export interface HeroProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  variant?: "default" | "small" | "cinema";
  backgroundImage?: string;
  videoBackground?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export function Hero({
  title,
  subtitle,
  variant = "default",
  backgroundImage,
  videoBackground,
  showButton = true,
  buttonText = "Discover office furniture",
  buttonLink = "/products",
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const isSmall = variant === "small";
  const isCinema = variant === "cinema";

  const getHeightClass = () => {
    if (isSmall) return "h-[50vh] min-h-[400px]";
    if (isCinema) return "h-[85vh] md:h-screen md:min-h-[1050px]";
    return "h-[80vh] md:h-screen";
  };

  return (
    <section
      ref={containerRef}
      className={`scheme-panel-dark relative w-full overflow-hidden group hero-section ${getHeightClass()}${isSmall ? " page-hero" : ""}`}
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: yParallax, opacity: opacityFade }}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
      >
        {videoBackground ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={backgroundImage}
            className="w-full h-full object-cover scale-105 transition-opacity duration-1000 opacity-0 data-[ready=true]:opacity-100"
            onCanPlay={(e) => (e.currentTarget.dataset.ready = "true")}
          >
            <source src={videoBackground} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <Image
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full" />
        )}

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-linear-to-t from-black/72 via-transparent to-black/28" />
      </motion.div>

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="container-wide h-full flex flex-col justify-center pb-20 pt-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl space-y-8"
          >
            <motion.div variants={titleVariants} className="overflow-hidden">
              <h1
                className={`hero-title ${isSmall ? "text-4xl md:text-6xl" : "text-ui-56 sm:text-ui-72 md:text-ui-96"} scheme-text-inverse`}
              >
                {title || (
                  <>
                    Create your <br />
                    <span className="hero-accent scheme-text-inverse-muted">
                      best work.
                    </span>
                  </>
                )}
              </h1>
            </motion.div>

            {subtitle && (
              <motion.p
                variants={titleVariants}
                className="hero-subtitle scheme-text-inverse-muted max-w-2xl"
              >
                {subtitle}
              </motion.p>
            )}

            {showButton && (
              <motion.div variants={titleVariants} className="pt-8">
                <Link
                  href={buttonLink}
                  className="btn-primary group px-8 py-4 md:px-10"
                >
                  <span className="text-sm font-bold uppercase tracking-ui-020">
                    {buttonText}
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
