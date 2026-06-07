"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/#honors", label: "荣誉" },
  { href: "/skills", label: "技能" },
  { href: "/contact", label: "联系" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  // Scroll detection for homepage transparency
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    function handleScroll() {
      setIsScrolled(window.scrollY > 50);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) {
      return pathname === "/" || pathname === href.split("#")[0];
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav
      className={cn(
        "top-0 left-0 right-0 z-50 transition-all duration-300",
        isHome && !isScrolled
          ? "absolute bg-transparent"
          : "fixed border-b border-black/8 dark:border-white/10 bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className={cn(
          "text-lg font-bold tracking-tight transition-colors",
          isHome && !isScrolled ? "invisible" : ""
        )}>
          <span className="text-brand-cyan">ZhaoyanHub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive(link.href)
                  ? "bg-black/5 dark:bg-white/10 text-foreground"
                  : isHome && !isScrolled
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
          >
            工作台
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "ml-2 rounded-md p-2 transition-colors",
                isHome && !isScrolled
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
              )}
              title={theme === "dark" ? "切换浅色" : "切换深色"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "rounded-md p-2",
                isHome && !isScrolled ? "text-white/70" : "text-muted-foreground"
              )}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "rounded-md p-2",
              isHome && !isScrolled ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-black/8 dark:border-white/10 bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-black/5 dark:bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="block rounded-md bg-primary/10 px-3 py-2.5 text-sm text-primary"
            >
              工作台
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
