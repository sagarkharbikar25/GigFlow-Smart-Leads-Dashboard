import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Shield,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav items configuration
  const navigationItems = [
    {
      name: 'Leads Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* ==========================================
         🖥️ Desktop Sidebar (Static Sidebar)
         ========================================== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-brand-surface border-r border-brand-border/60 p-6 flex-shrink-0 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none"></div>

        {/* Sidebar Brand Logo */}
        <div className="flex items-center space-x-3 mb-8 px-2 relative">
          <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-brand-primary">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">GigFlow</span>
        </div>

        {/* User Identity Box */}
        {user && (
          <div className="mb-8 p-4 bg-brand-dark/40 border border-brand-border/50 rounded-2xl relative">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-base shadow-premium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  {user.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-brand-secondary" />
                  ) : (
                    <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted truncate">
                    {user.role === 'admin' ? 'Administrator' : 'Sales Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Sidebar Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm group ${
                  isActive
                    ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary shadow-glow-primary/5'
                    : 'text-brand-muted hover:text-white hover:bg-brand-border/30 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-brand-primary' : 'text-brand-muted group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Logout Trigger */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-brand-danger bg-brand-danger/5 hover:bg-brand-danger/10 border border-brand-danger/10 rounded-xl transition-all font-semibold text-sm mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* ==========================================
         📱 Mobile Sidebar Drawer (Overlay)
         ========================================== */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-72 max-w-xs bg-brand-surface p-6 h-full shadow-premium animate-fade-in z-10 border-r border-brand-border/60">
            {/* Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-5 right-5 p-2 bg-brand-dark/50 border border-brand-border rounded-xl text-brand-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mobile Logo */}
            <div className="flex items-center space-x-3 mb-8 px-2">
              <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-brand-primary">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-wider text-white">GigFlow</span>
            </div>

            {/* User Identity Box */}
            {user && (
              <div className="mb-8 p-4 bg-brand-dark/40 border border-brand-border/50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-base">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      {user.role === 'admin' ? (
                        <Shield className="w-3.5 h-3.5 text-brand-secondary" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted truncate">
                        {user.role === 'admin' ? 'Administrator' : 'Sales Member'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                      isActive
                        ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary'
                        : 'text-brand-muted hover:text-white hover:bg-brand-border/30 border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Trigger */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-brand-danger bg-brand-danger/5 hover:bg-brand-danger/10 border border-brand-danger/10 rounded-xl transition-all font-semibold text-sm mt-auto"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}

      {/* ==========================================
         🚪 Primary Right Main Content Viewport
         ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navbar */}
        <header className="h-16 bg-brand-surface/50 backdrop-blur-md border-b border-brand-border/50 flex items-center justify-between px-6 flex-shrink-0 z-40 sticky top-0">
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Trigger Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 bg-brand-dark/50 border border-brand-border rounded-xl text-brand-muted hover:text-white transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              Smart Leads Dashboard
            </h2>
          </div>

          {/* Quick Stats/Date indicator */}
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-xs font-semibold text-brand-muted bg-brand-border/50 border border-brand-border/70 rounded-full px-3 py-1">
              🏢 {user?.role === 'admin' ? 'All Leads View' : 'My Territory'}
            </span>
          </div>
        </header>

        {/* Inner Content Injection Block */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
