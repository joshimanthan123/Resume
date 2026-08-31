import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { getToken, getStoredUser, logout, getMe } from './api';

export default function App() {
  const location = useLocation();

  // Global Auth state
  const [user, setUser] = useState(() => getStoredUser());

  // Dark/Light Mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Verify stored token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const me = await getMe();
          if (me) {
            setUser(me);
          }
        } catch (err) {
          // Token invalid or expired
          handleLogout();
        }
      } else {
        setUser(null);
      }
    };
    verifyUser();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Apply dark mode class to root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Scroll Progress Bar logic
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      const progressEl = document.getElementById("scroll-progress");
      if (progressEl) {
        progressEl.style.width = scrolled + "%";
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // IntersectionObserver for elements with '.reveal' class
  useEffect(() => {
    const revealCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      threshold: 0.1
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => revealObserver.observe(el));

    return () => {
      elements.forEach(el => revealObserver.unobserve(el));
    };
  }, [location.pathname]);

  // Reset scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-on-background text-on-background dark:text-gray-250 transition-colors duration-300">
      {/* Scroll Progress Indicator */}
      <div id="scroll-progress" className="transition-all duration-100"></div>

      {/* Sticky NavBar Header */}
      <NavBar 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Pages Layout Container */}
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/projects" 
            element={
              <Projects 
                user={user} 
                setUser={setUser} 
                onLogout={handleLogout} 
              />
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <Projects 
                user={user} 
                setUser={setUser} 
                onLogout={handleLogout} 
              />
            } 
          />
          <Route path="/contact" element={<Contact />} />
          {/* Custom 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Consistent Footer */}
      <Footer />
    </div>
  );
}
