"use client";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Categories", href: "#categories" },
  { label: "Videos", href: "#videos" },
  { label: "Stats", href: "#stats" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-[rgba(0,212,255,0.12)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[var(--color-neon-blue)] opacity-20 rounded-sm rotate-45 group-hover:opacity-40 transition-opacity" />
              <Zap size={16} className="text-[var(--color-neon-blue)] relative z-10" />
            </div>
            <span
              className="text-xl tracking-widest text-[var(--color-text-primary)] flicker"
              style={{ fontFamily: "var(--font-display)" }}
            >
              BEHIND THE TECH
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-xs font-mono tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-neon-blue)] transition-colors duration-300 uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("#newsletter")}
              className="btn-primary text-xs py-2 px-5 rounded-none"
            >
              Subscribe
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[var(--color-neon-blue)] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 glass flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link, i) => (
          <button
            key={link.href}
            onClick={() => handleNavClick(link.href)}
            className="text-4xl tracking-widest text-[var(--color-text-primary)] hover:text-[var(--color-neon-blue)] transition-colors"
            style={{
              fontFamily: "var(--font-display)",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={() => handleNavClick("#newsletter")}
          className="btn-primary text-sm py-3 px-10 rounded-none mt-4"
        >
          Subscribe
        </button>
      </div>
    </>
  );
}
