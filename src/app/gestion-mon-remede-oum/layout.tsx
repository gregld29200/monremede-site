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
    <div className="admin-layout font-[var(--font-admin)]">
      {/* Clean neutral background */}
      <div className="fixed inset-0 bg-[#f8f9fa] -z-10" />

      <div className={`flex min-h-screen transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className={`flex-1 flex flex-col transition-[margin] duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
          <AdminTopbar />

          <main className="flex-1 p-8 overflow-auto scroll-pt-4">
            <div className="max-w-7xl mx-auto animate-fade-up">
              {children}
            </div>
          </main>

          {/* Footer accent */}
          <footer className="px-8 py-4 border-t border-[#e5e7eb]">
            <p className="text-xs text-[#9ca3af] text-center">
              Mon Remède · Espace Administration · {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        .admin-layout {
          --admin-sidebar-width: 288px;
          --admin-sidebar-collapsed: 80px;
          font-family: var(--font-admin), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Override body fonts for admin content */
        .admin-layout main,
        .admin-layout main * {
          font-family: var(--font-admin), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
          background: #d1d5db;
          border-radius: 3px;
        }

        .admin-layout ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Clean card style */
        .admin-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .admin-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #d1d5db;
        }

        /* Botanical pattern overlay for dark sections (sidebar only) */
        .botanical-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c0 8-6 15-15 20 9 5 15 12 15 20 0-8 6-15 15-20-9-5-15-12-15-20z' fill='%23ffffff' fill-opacity='0.02'/%3E%3C/svg%3E");
        }

        /* ===== KEYFRAME ANIMATIONS ===== */

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ===== UTILITY CLASSES ===== */

        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }

        .animate-scale-up {
          animation: scaleUp 0.25s ease-out forwards;
        }

        /* Staggered fade in for lists */
        .stagger-fade > * {
          opacity: 0;
          animation: fadeSlideUp 0.4s ease forwards;
        }

        .stagger-fade > *:nth-child(1) { animation-delay: 0.03s; }
        .stagger-fade > *:nth-child(2) { animation-delay: 0.06s; }
        .stagger-fade > *:nth-child(3) { animation-delay: 0.09s; }
        .stagger-fade > *:nth-child(4) { animation-delay: 0.12s; }
        .stagger-fade > *:nth-child(5) { animation-delay: 0.15s; }
        .stagger-fade > *:nth-child(6) { animation-delay: 0.18s; }
        .stagger-fade > *:nth-child(7) { animation-delay: 0.21s; }
        .stagger-fade > *:nth-child(8) { animation-delay: 0.24s; }
        .stagger-fade > *:nth-child(9) { animation-delay: 0.27s; }
        .stagger-fade > *:nth-child(10) { animation-delay: 0.30s; }

        /* Focus ring for accessibility */
        .admin-focus-ring:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        /* ===== STATUS INDICATORS ===== */

        .status-active {
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          color: #059669;
        }

        .status-pending {
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #d97706;
        }

        .status-archived {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #6b7280;
        }

        /* ===== DATA TABLE STYLES ===== */

        .admin-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 14px;
        }

        .admin-table th {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6b7280;
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
          color: #111827;
          transition: background 0.15s ease;
        }

        .admin-table tbody tr:hover td {
          background: #f9fafb;
        }

        .admin-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* ===== FORM INPUTS ===== */

        .admin-input {
          width: 100%;
          padding: 10px 14px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-family: var(--font-admin), sans-serif;
          font-size: 14px;
          color: #111827;
          transition: all 0.15s ease;
        }

        .admin-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .admin-input::placeholder {
          color: #9ca3af;
        }

        /* Select dropdown */
        .admin-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
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
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        /* ===== LOADING STATES ===== */

        .admin-skeleton {
          background: linear-gradient(
            90deg,
            #f3f4f6 0%,
            #e5e7eb 50%,
            #f3f4f6 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 6px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ===== BUTTONS ===== */

        .admin-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          background: #2563eb;
          color: white;
          font-weight: 500;
          font-size: 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .admin-btn-primary:hover {
          background: #1d4ed8;
        }

        .admin-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 18px;
          background: white;
          color: #374151;
          font-weight: 500;
          font-size: 14px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .admin-btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        /* ===== BADGES ===== */

        .admin-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          border-radius: 9999px;
        }

        .admin-badge-blue {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .admin-badge-green {
          background: #d1fae5;
          color: #059669;
        }

        .admin-badge-yellow {
          background: #fef3c7;
          color: #d97706;
        }

        .admin-badge-red {
          background: #fee2e2;
          color: #dc2626;
        }

        .admin-badge-gray {
          background: #f3f4f6;
          color: #6b7280;
        }
      `}</style>
    </div>
  )
}
