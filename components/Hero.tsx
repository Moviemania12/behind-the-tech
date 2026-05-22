"use client";
"use client";
import { useEffect, useRef } from "react";
import { ChevronDown, Play } from "lucide-react";

function ServerRackSVG() {
  return (
    <svg viewBox="0 0 200 400" className="w-full h-full opacity-60" fill="none">
      {/* Rack frame */}
      <rect x="10" y="10" width="180" height="380" rx="4" stroke="rgba(0,212,255,0.3)" strokeWidth="1" fill="rgba(0,212,255,0.02)" />
      {/* Rack units */}
      {Array.from({ length: 14 }).map((_, i) => (
        <g key={i}>
          <rect
            x="18" y={18 + i * 26} width="164" height="20" rx="2"
            fill={i % 3 === 0 ? "rgba(0,212,255,0.08)" : "rgba(0,212,255,0.04)"}
            stroke="rgba(0,212,255,0.15)" strokeWidth="0.5"
          />
          {/* LED indicators */}
          <circle cx="30" cy={28 + i * 26} r="2.5"
            fill={i % 4 === 0 ? "rgba(255,34,68,0.9)" : "rgba(0,212,255,0.9)"}
            style={{ filter: "blur(1px)" }}
          />
          <circle cx="38" cy={28 + i * 26} r="1.5" fill="rgba(0,255,100,0.7)" />
          {/* Drive slots */}
          {Array.from({ length: 5 }).map((_, j) => (
            <rect
              key={j} x={55 + j * 24} y={22 + i * 26} width="18" height="12" rx="1"
              fill="rgba(0,0,0,0.4)" stroke="rgba(0,212,255,0.1)" strokeWidth="0.5"
            />
          ))}
          {/* Port area */}
          <rect x="158" y={22 + i * 26} width="16" height="5" rx="1" fill="rgba(0,212,255,0.1)" />
          <rect x="158" y={30 + i * 26} width="16" height="5" rx="1" fill="rgba(0,212,255,0.1)" />
        </g>
      ))}
      {/* Cable runs */}
      <path d="M20 380 Q10 300 10 200 Q10 100 20 20" stroke="rgba(0,212,255,0.1)" strokeWidth="8" fill="none" />
      <path d="M180 380 Q190 300 190 200 Q190 100 180 20" stroke="rgba(0,212,255,0.1)" strokeWidth="8" fill="none" />
    </svg>
  );
}

function FloatingParticle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <div
      className="absolute rounded-full bg-[var(--color-neon-blue)]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        opacity: 0.4,
        filter: "blur(1px)",
        animation: `float ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg scanline">
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Radial gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,34,68,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* Server racks - desktop only */}
      <div className="absolute left-[-2%] top-0 bottom-0 w-[18%] hidden lg:flex items-center opacity-40">
        <ServerRackSVG />
      </div>
      <div className="absolute right-[-2%] top-0 bottom-0 w-[18%] hidden lg:flex items-center opacity-40 scale-x-[-1]">
        <ServerRackSVG />
      </div>

      {/* Top data readout bar */}
      <div className="absolute top-20 left-0 right-0 flex justify-center z-10">
        <div className="flex items-center gap-6 px-6 py-2 glass rounded-none border-x-0"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
          <span className="text-[var(--color-neon-blue)] tracking-widest">SYS.STATUS: ONLINE</span>
          <span className="text-[var(--color-text-muted)]">|</span>
          <span className="text-[var(--color-neon-cyan)] tracking-widest">UPTIME: 99.97%</span>
          <span className="text-[var(--color-text-muted)]">|</span>
          <span className="text-[var(--color-neon-red)] tracking-widest pulse-red">LIVE</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-16">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="tech-line w-16" />
          <span className="text-xs tracking-[0.4em] text-[var(--color-neon-blue)] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}>
            Documentary · Technology · Infrastructure
          </span>
          <div className="tech-line w-16" />
        </div>

        <h1
          className="text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-wider mb-2 flicker"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="block text-[var(--color-text-primary)]">BEHIND</span>
          <span className="block gradient-text">THE TECH</span>
        </h1>

        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-[var(--color-text-secondary)] mb-12 mt-6"
          style={{ fontFamily: "var(--font-mono)" }}>
          Technology that powers the modern world
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="btn-primary rounded-none flex items-center gap-3 text-sm"
            onClick={() => document.querySelector("#categories")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Play size={16} fill="currentColor" />
            Explore Technology
          </button>
          <button
            className="btn-outline rounded-none text-sm"
            onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          >
            Learn More
          </button>
        </div>

        {/* Tech spec strip */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { label: "Petabytes", value: "500+" },
            { label: "Data Centers", value: "1,200+" },
            { label: "AI Models", value: "10K+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-[var(--color-neon-blue)]"
                style={{ fontFamily: "var(--font-display)" }}>{stat.value}</div>
              <div className="text-[10px] tracking-widest text-[var(--color-text-muted)] uppercase mt-1"
                style={{ fontFamily: "var(--font-mono)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] tracking-widest text-[var(--color-text-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}>SCROLL</span>
        <ChevronDown size={16} className="text-[var(--color-neon-blue)] animate-bounce" />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10"
        style={{ background: "linear-gradient(transparent, var(--color-void))" }} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
