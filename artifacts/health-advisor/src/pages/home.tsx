import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import heroDoctorImg from "@assets/generated_images/hero_doctor.png";
import mobileHealthImg from "@assets/generated_images/mobile_health.png";
import healthWellnessImg from "@assets/generated_images/health_wellness.png";

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex flex-col lg:flex-row items-stretch overflow-hidden" style={{ position: "relative" }}>
        {/* Text side */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-20 lg:py-0 lg:w-1/2 lg:pl-16 xl:pl-24 bg-gradient-to-br from-background via-background to-primary/5">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-4 border border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
              Free · Private · Instant
            </span>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Understand your<br />
              <span className="text-primary">symptoms</span><br />
              in plain language.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Get clear, calm guidance on what you might be experiencing and exactly what to do next — without the wait, without the jargon.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/20" asChild>
                <Link href="/check">
                  Check my symptoms <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button size="lg" variant="outline" className="h-14 px-8 text-base" asChild>
                  <Link href="/register">Create free account</Link>
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {["No appointment needed", "Results in under 2 minutes", "Built for Nigerian conditions"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Your data is private and never shared
            </p>
          </motion.div>
        </div>

        {/* Image side */}
        <motion.div
          className="relative lg:w-1/2 h-72 sm:h-96 lg:h-auto overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <img
            src={heroDoctorImg}
            alt="Healthcare professional with patient"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent lg:from-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 lg:from-transparent via-transparent to-transparent" />

          {/* Floating stat card */}
          <motion.div
            className="absolute bottom-8 left-6 lg:left-8 bg-background/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-2xl font-bold text-foreground">12+</p>
            <p className="text-xs text-muted-foreground">Common conditions covered</p>
          </motion.div>

          <motion.div
            className="absolute top-8 right-6 bg-background/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border border-border/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-2xl font-bold text-primary">Free</p>
            <p className="text-xs text-muted-foreground">Always, for everyone</p>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-muted-foreground/60 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-xs">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ── Triage levels strip ── */}
      <FadeInSection>
        <section className="px-4 py-12 bg-muted/30 border-y border-border/60">
          <div className="container mx-auto max-w-5xl">
            <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wider font-medium">
              We give you a clear urgency level every time
            </p>
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Go to Emergency", color: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500" },
                { label: "See a Doctor Soon", color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500" },
                { label: "Monitor Symptoms", color: "bg-yellow-50 border-yellow-200 text-yellow-700", dot: "bg-yellow-400" },
                { label: "Self-Care Recommended", color: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
              ].map((item) => (
                <StaggerItem key={item.label}>
                  <div className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 ${item.color}`}>
                    <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${item.dot}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      </FadeInSection>

      {/* ── How it works ── */}
      <section className="px-4 py-20 container mx-auto max-w-5xl">
        <FadeInSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">How it works</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
            Three simple steps to get guidance on your symptoms.
          </p>
        </FadeInSection>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <StaggerChildren className="flex flex-col gap-8">
            {[
              {
                step: "01",
                title: "Tell us a little about yourself",
                desc: "Optionally share your age, gender, and how long you've been feeling unwell. This helps us give you more accurate guidance.",
              },
              {
                step: "02",
                title: "Select your symptoms",
                desc: "Choose from a clear, grouped list of common symptoms — from fever and chills to stomach pain or skin changes.",
              },
              {
                step: "03",
                title: "Get your results instantly",
                desc: "See what condition might be causing your symptoms, your urgency level, self-care steps, and when to see a doctor.",
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="flex gap-5 items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center border border-primary/20">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}

            <StaggerItem>
              <Button size="lg" className="mt-2 w-full sm:w-auto h-13 px-8 shadow-md shadow-primary/20" asChild>
                <Link href="/check">Start the symptom checker <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </StaggerItem>
          </StaggerChildren>

          <FadeInSection delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-emerald-100/30 rounded-3xl blur-2xl" />
              <img
                src={mobileHealthImg}
                alt="Using HealthAdvisor on mobile"
                className="relative rounded-3xl shadow-2xl w-full max-w-sm mx-auto object-cover"
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Community & trust ── */}
      <section className="bg-primary/5 border-y border-primary/10 py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-100/40 to-primary/5 rounded-3xl blur-2xl" />
                <img
                  src={healthWellnessImg}
                  alt="Health and wellness"
                  className="relative rounded-3xl shadow-xl w-full max-w-sm mx-auto object-cover aspect-square"
                />
              </div>
            </FadeInSection>

            <FadeInSection delay={0.15}>
              <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-4 border border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
                Built for underserved communities
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Healthcare guidance when you need it most.
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Millions of Nigerians lack immediate access to a doctor. HealthAdvisor bridges that gap — giving you reliable, evidence-based guidance for common conditions like Malaria, Typhoid, Hypertension, and more, right on your phone.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                This is not a replacement for medical care. It's a trusted first step — helping you understand your symptoms and decide the right next action.
              </p>
              <StaggerChildren className="flex flex-col gap-3">
                {[
                  "Covers 12 common Nigerian conditions",
                  "Available 24/7 — no internet queues",
                  "Plain, everyday language — no medical degree needed",
                  "Saves your history so you can track your health",
                ].map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Conditions covered ── */}
      <section className="px-4 py-20 container mx-auto max-w-5xl">
        <FadeInSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Conditions we cover</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Our advisory engine is built specifically for conditions common in Nigeria and West Africa.
          </p>
        </FadeInSection>

        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            "Malaria", "Typhoid Fever", "Influenza", "Common Cold",
            "Hypertension", "Gastroenteritis", "Urinary Tract Infection", "Severe Malaria",
            "Meningitis", "Diabetes", "Hepatitis", "Anaemia",
          ].map((condition) => (
            <StaggerItem key={condition}>
              <div className="border border-border/60 rounded-xl px-4 py-3 text-sm text-center hover:border-primary/40 hover:bg-primary/5 transition-colors duration-200 cursor-default">
                {condition}
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeInSection delay={0.2}>
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/diseases">View full conditions guide <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeInSection>
      </section>

      {/* ── Final CTA ── */}
      <FadeInSection>
        <section className="px-4 py-20 mx-4 mb-10 rounded-3xl bg-primary text-primary-foreground text-center overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative container mx-auto max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to check your symptoms?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              It takes less than 2 minutes and it's completely free.
            </p>
            <Button size="lg" variant="secondary" className="h-14 px-10 text-base font-semibold shadow-lg" asChild>
              <Link href="/check">Start now — it's free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </FadeInSection>

      {/* ── Disclaimer ── */}
      <section className="px-4 py-8 text-center text-xs text-muted-foreground container mx-auto max-w-3xl border-t border-border/40">
        <p>
          <strong>Medical disclaimer:</strong> HealthAdvisor is an informational tool only and does not replace professional medical advice, diagnosis, or treatment.
          Always consult a qualified healthcare provider with any questions about a medical condition. In an emergency, go to your nearest hospital immediately.
        </p>
      </section>
    </div>
  );
}
