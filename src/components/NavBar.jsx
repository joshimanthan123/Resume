import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function NavBar({ darkMode, toggleDarkMode, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeStyle = "text-primary dark:text-primary-compiler font-semibold border-b-2 border-primary pb-1 transition-all duration-200";
  const inactiveStyle = "text-on-surface-variant hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors duration-200";

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-inverse-surface/80 backdrop-blur-md border-b border-outline-variant dark:border-outline/35 transition-all duration-300">
      <nav className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Name */}
        <div className="flex items-center gap-2">
          <span className="font-headline-md text-headline-md text-on-surface dark:text-white tracking-tight font-bold">
            Manthan Joshi
          </span>
          <span className="hidden md:block w-px h-6 bg-outline-variant dark:bg-outline/50 mx-2"></span>
          <span className="hidden md:block font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400 uppercase tracking-widest">
            Student Portfolio
          </span>
        </div>

        {/* Links & Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Home
          </NavLink>
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Task Manager
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Contact
          </NavLink>

          {/* User Auth Info / Logout */}
          {user ? (
            <div className="flex items-center gap-3 bg-surface-container-low dark:bg-inverse-surface/60 px-3 py-1.5 rounded-xl border border-outline-variant/40 dark:border-outline/20">
              <span className="material-symbols-outlined text-[18px] text-primary dark:text-[#5c8bee]">
                account_circle
              </span>
              <span className="text-xs font-semibold text-on-surface dark:text-gray-200">
                {user.email}
              </span>
              <button
                onClick={onLogout}
                className="px-2.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Sign out of account"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Logout
              </button>
            </div>
          ) : null}

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-on-surface dark:text-white hover:bg-surface-container dark:hover:bg-on-surface-variant/35 rounded-full transition-all duration-300 flex items-center justify-center"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined transition-transform duration-500 hover:rotate-45">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        {/* Icons for mobile */}
        <div className="flex md:hidden items-center gap-3">
          {user && (
            <button
              onClick={onLogout}
              className="p-1.5 text-xs text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          )}

          <button 
            onClick={toggleDarkMode}
            className="p-2 text-on-surface dark:text-white hover:bg-surface-container dark:hover:bg-on-surface-variant/35 rounded-full transition-all duration-300 flex items-center justify-center"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-on-surface dark:text-white hover:bg-surface-container dark:hover:bg-on-surface-variant/35 rounded-full transition-all"
            aria-label="Toggle Mobile Menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-inverse-surface border-b border-outline-variant dark:border-outline/35 transition-all duration-300">
          <div className="flex flex-col px-margin-mobile py-4 gap-4 font-body-md">
            {user && (
              <div className="text-xs font-mono text-primary dark:text-[#5c8bee] pb-2 border-b border-outline-variant/40">
                Logged in as: {user.email}
              </div>
            )}
            <NavLink 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => isActive ? `py-2 ${activeStyle}` : `py-2 ${inactiveStyle}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/tasks" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => isActive ? `py-2 ${activeStyle}` : `py-2 ${inactiveStyle}`}
            >
              Task Manager
            </NavLink>
            <NavLink 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => isActive ? `py-2 ${activeStyle}` : `py-2 ${inactiveStyle}`}
            >
              Contact
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
