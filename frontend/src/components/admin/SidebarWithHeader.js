import React, { useState } from 'react';
import SidebarContent from './SidebarContent';
import MobileNav from './MobileNav';
import { ErrorBoundary } from '.';

export default function SidebarWithHeader({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-champagne font-body">
        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed inset-y-0 left-0 w-60 z-40">
          <SidebarContent onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-bronze/40 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 h-full">
              <SidebarContent onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Top Nav */}
        <MobileNav onOpen={() => setIsSidebarOpen(true)} />

        {/* Main Content */}
        <div className="md:ml-60 p-4 md:p-6">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  );
}
