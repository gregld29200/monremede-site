'use client'

import { useState, useSyncExternalStore } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'

// Hook to detect client-side mounting without useEffect
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const mounted = useIsMounted()

  return (
    <div className="admin-layout">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-[#fafafa] to-[#f5f5f5] -z-10" />
      <div className="fixed inset-0 opacity-[0.015] -z-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      <div className={`flex min-h-screen transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
          <AdminTopbar />

          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto animate-fade-up">
              {children}
            </div>
          </main>

          {/* Footer accent */}
          <footer className="px-8 py-4 border-t border-forest/5">
            <p className="font-accent text-xs text-ink-soft/50 text-center tracking-wider">
              Mon Remède · Espace Administration · {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        .admin-layout {
          --admin-sidebar-width: 288px;
          --admin-sidebar-collapsed: 80px;
        }

        /* Refined scrollbar for admin */
        .admin-layout ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .admin-layout ::-webkit-scrollbar-track {
          background: transparent;
        }

        .admin-layout ::-webkit-scrollbar-thumb {
          background: rgba(45, 74, 62, 0.2);
          border-radius: 3px;
        }

        .admin-layout ::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 74, 62, 0.35);
        }

        /* Organic card hover effect */
        .admin-card {
          position: relative;
          background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,250,250,0.95) 100%);
          border: 1px solid rgba(45, 74, 62, 0.08);
          border-radius: 16px;
          box-shadow:
            0 1px 2px rgba(26, 46, 35, 0.04),
            0 4px 12px rgba(26, 46, 35, 0.03);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 4px 8px rgba(26, 46, 35, 0.06),
            0 12px 32px rgba(26, 46, 35, 0.08);
          border-color: rgba(196, 163, 90, 0.2);
        }

        /* Botanical pattern overlay for dark sections */
        .botanical-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c0 8-6 15-15 20 9 5 15 12 15 20 0-8 6-15 15-20-9-5-15-12-15-20z' fill='%23ffffff' fill-opacity='0.02'/%3E%3C/svg%3E");
        }

        /* ===== KEYFRAME ANIMATIONS ===== */

        /* Page entrance animation */
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Gold shimmer effect */
        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* Soft pulse for notifications */
        @keyframes softPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        /* Gentle float for decorative elements */
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(1deg);
          }
        }

        /* Breathing glow for ambient lighting */
        @keyframes breathingGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        /* Slide in from left */
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Scale up entrance */
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Subtle bounce */
        @keyframes subtleBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        /* ===== UTILITY CLASSES ===== */

        .gold-shimmer {
          background: linear-gradient(
            90deg,
            var(--gold) 0%,
            var(--gold-light) 25%,
            var(--gold) 50%,
            var(--gold-light) 75%,
            var(--gold) 100%
          );
          background-size: 200% auto;
          animation: goldShimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animate-soft-pulse {
          animation: softPulse 2s ease-in-out infinite;
        }

        .animate-gentle-float {
          animation: gentleFloat 4s ease-in-out infinite;
        }

        .animate-breathing-glow {
          animation: breathingGlow 4s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .animate-scale-up {
          animation: scaleUp 0.4s ease-out forwards;
        }

        .animate-subtle-bounce:hover {
          animation: subtleBounce 0.4s ease-in-out;
        }

        /* Staggered fade in for lists */
        .stagger-fade > * {
          opacity: 0;
          animation: fadeSlideUp 0.5s ease forwards;
        }

        .stagger-fade > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger-fade > *:nth-child(2) { animation-delay: 0.1s; }
        .stagger-fade > *:nth-child(3) { animation-delay: 0.15s; }
        .stagger-fade > *:nth-child(4) { animation-delay: 0.2s; }
        .stagger-fade > *:nth-child(5) { animation-delay: 0.25s; }
        .stagger-fade > *:nth-child(6) { animation-delay: 0.3s; }
        .stagger-fade > *:nth-child(7) { animation-delay: 0.35s; }
        .stagger-fade > *:nth-child(8) { animation-delay: 0.4s; }
        .stagger-fade > *:nth-child(9) { animation-delay: 0.45s; }
        .stagger-fade > *:nth-child(10) { animation-delay: 0.5s; }

        /* Staggered slide-in variant */
        .stagger-slide > * {
          opacity: 0;
          animation: slideInLeft 0.4s ease-out forwards;
        }

        .stagger-slide > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger-slide > *:nth-child(2) { animation-delay: 0.1s; }
        .stagger-slide > *:nth-child(3) { animation-delay: 0.15s; }
        .stagger-slide > *:nth-child(4) { animation-delay: 0.2s; }
        .stagger-slide > *:nth-child(5) { animation-delay: 0.25s; }
        .stagger-slide > *:nth-child(6) { animation-delay: 0.3s; }

        /* ===== INTERACTIVE EFFECTS ===== */

        /* Button glow on hover */
        .admin-btn-glow {
          position: relative;
          overflow: hidden;
        }

        .admin-btn-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(196, 163, 90, 0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .admin-btn-glow:hover::before {
          opacity: 1;
        }

        /* Card shine effect on hover */
        .admin-card-shine {
          position: relative;
          overflow: hidden;
        }

        .admin-card-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          transform: rotate(30deg) translateX(-100%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }

        .admin-card-shine:hover::after {
          transform: rotate(30deg) translateX(100%);
        }

        /* Focus ring for accessibility */
        .admin-focus-ring:focus-visible {
          outline: 2px solid rgba(196, 163, 90, 0.5);
          outline-offset: 2px;
        }

        /* ===== STATUS INDICATORS ===== */

        .status-active {
          background: linear-gradient(135deg, rgba(139, 158, 126, 0.15) 0%, rgba(139, 158, 126, 0.05) 100%);
          border-color: rgba(139, 158, 126, 0.3);
          color: var(--sage);
        }

        .status-pending {
          background: linear-gradient(135deg, rgba(196, 163, 90, 0.15) 0%, rgba(196, 163, 90, 0.05) 100%);
          border-color: rgba(196, 163, 90, 0.3);
          color: var(--gold);
        }

        .status-archived {
          background: linear-gradient(135deg, rgba(61, 61, 56, 0.1) 0%, rgba(61, 61, 56, 0.03) 100%);
          border-color: rgba(61, 61, 56, 0.15);
          color: var(--ink-soft);
        }

        /* ===== DATA TABLE STYLES ===== */

        .admin-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .admin-table th {
          font-family: var(--font-accent);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-soft);
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(45, 74, 62, 0.08);
          background: rgba(250, 250, 250, 0.8);
        }

        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(45, 74, 62, 0.04);
          transition: background 0.2s ease;
        }

        .admin-table tbody tr:hover td {
          background: rgba(196, 163, 90, 0.03);
        }

        .admin-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* ===== FORM INPUTS ===== */

        .admin-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(45, 74, 62, 0.1);
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--forest);
          transition: all 0.3s ease;
        }

        .admin-input:focus {
          outline: none;
          background: white;
          border-color: rgba(196, 163, 90, 0.4);
          box-shadow: 0 0 0 3px rgba(196, 163, 90, 0.1);
        }

        .admin-input::placeholder {
          color: rgba(61, 61, 56, 0.4);
        }

        /* Select dropdown */
        .admin-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232D4A3E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 40px;
        }

        /* ===== EMPTY STATE ===== */

        .admin-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
        }

        .admin-empty-state-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(45, 74, 62, 0.08) 0%, rgba(45, 74, 62, 0.02) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        /* ===== LOADING STATES ===== */

        .admin-skeleton {
          background: linear-gradient(
            90deg,
            rgba(45, 74, 62, 0.05) 0%,
            rgba(45, 74, 62, 0.1) 50%,
            rgba(45, 74, 62, 0.05) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
