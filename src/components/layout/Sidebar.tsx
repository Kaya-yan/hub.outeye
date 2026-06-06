"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Wallet,
  Lightbulb,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

const sidebarLinks = [
  { href: "/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/dashboard/ai-hub", label: "AI Hub", icon: MessageSquare },
  { href: "/dashboard/data", label: "数据中心", icon: BarChart3 },
  { href: "/dashboard/ai-budget", label: "额度监控", icon: Wallet },
  { href: "/dashboard/ideas", label: "灵感收集", icon: Lightbulb },
  { href: "/dashboard/settings", label: "设置", icon: Settings },
];

function NavContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <nav className="flex-1 space-y-1 p-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-black/8 dark:border-white/10 p-2 space-y-1">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
            title={collapsed ? (theme === "dark" ? "浅色模式" : "深色模式") : undefined}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {!collapsed && <span>{theme === "dark" ? "浅色模式" : "深色模式"}</span>}
          </button>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
          title={collapsed ? "退出" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>退出</span>}
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 rounded-md p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-black/8 dark:border-white/10 bg-sidebar transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-black/8 dark:border-white/10 px-4">
          <span className="text-sm font-bold text-brand-cyan">ZhaoyanHub</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <NavContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col border-r border-black/8 dark:border-white/10 bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-56"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-black/8 dark:border-white/10 px-3">
          {!collapsed && (
            <span className="text-sm font-bold text-brand-cyan">ZhaoyanHub</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
        <NavContent collapsed={collapsed} />
      </aside>
    </>
  );
}
