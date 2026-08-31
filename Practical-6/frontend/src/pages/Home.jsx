import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-background dark:bg-inverse-surface/10 duration-300">
      {/* Hero / About Section */}
      <section className="relative py-24 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden mesh-bg" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-7 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed dark:bg-primary/20 text-on-primary-fixed-variant dark:text-primary-fixed rounded-full mb-6">
              <span className="material-symbols-outlined text-[18px]">school</span>
              <span className="font-label-sm text-label-sm">Computer Science Undergraduate</span>
            </div>
            
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background dark:text-white mb-6">
              Building the future of <span className="text-primary dark:text-[#5c8bee]">Full-Stack AI</span>.
            </h1>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-gray-300 mb-10 max-w-2xl">
              Passionate Computer Science student focused on full-stack development and AI. I bridge the gap between academic rigor and practical software engineering, creating intuitive digital experiences with a focus on scalable architecture.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/contact" 
                className="btn-pulse px-8 py-4 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:bg-primary-container transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                Connect With Me <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a 
                href="#" 
                className="px-8 py-4 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/35 text-on-surface dark:text-white font-label-sm text-label-sm rounded-lg hover:bg-surface-container-low dark:hover:bg-on-surface-variant/35 transition-all flex items-center gap-2"
              >
                View Resume <span className="material-symbols-outlined text-[18px]">download</span>
              </a>
            </div>
          </div>

          {/* Profile Image & Interactive Badge */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] aspect-square animate-float">
              <div className="absolute inset-0 bg-primary-fixed dark:bg-primary/10 rounded-full transform rotate-6 opacity-30"></div>
              <div className="absolute inset-0 bg-secondary-fixed dark:bg-secondary/10 rounded-full transform -rotate-3 opacity-30"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white dark:border-inverse-surface shadow-2xl">
                {/* Note: In production React build we point to a dynamic asset or reference the exact sample image */}
                <div className="w-full h-full bg-cover bg-center flex items-center justify-center bg-surface-variant dark:bg-inverse-surface text-on-surface-variant dark:text-white">
                  <span className="material-symbols-outlined text-[96px]">person</span>
                </div>
              </div>

              {/* Floating Badge (Interactive Toggle) */}
              <button 
                onClick={() => setShowTooltip(!showTooltip)}
                className="absolute bottom-4 -left-4 glass-card p-4 rounded-xl shadow-xl flex items-center gap-3 hover:translate-y-[-2px] transition-all cursor-pointer select-none"
                aria-label="Toggle Details Box"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary dark:text-[#5c8bee]">
                  <span className="material-symbols-outlined">code</span>
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-bold text-primary dark:text-[#5c8bee] uppercase tracking-tighter">Available for</p>
                  <p className="text-body-md font-semibold text-on-surface dark:text-white flex items-center gap-1">
                    Summer Internships
                    <span className="material-symbols-outlined text-[14px]">info</span>
                  </p>
                </div>
              </button>

              {/* Tooltip Content Toggle */}
              {showTooltip && (
                <div className="absolute top-[80%] left-[-4%] w-[280px] bg-white dark:bg-inverse-surface p-6 rounded-xl shadow-2xl border border-outline-variant dark:border-outline/40 z-20 text-left animate-fade-in">
                  <div className="flex items-center justify-between mb-3 border-b pb-2 dark:border-outline/25">
                    <span className="font-bold text-on-surface dark:text-white text-sm">Role Preferences</span>
                    <button 
                      onClick={() => setShowTooltip(false)} 
                      className="text-on-surface-variant hover:text-primary dark:text-gray-400 dark:hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                  <ul className="text-xs text-on-surface-variant dark:text-gray-300 space-y-2">
                    <li className="flex justify-between"><strong>Interests:</strong> <span>Frontend, Full stack, NLP</span></li>
                    <li className="flex justify-between"><strong>Availability:</strong> <span>May - August 2026</span></li>
                    <li className="flex justify-between"><strong>Locations:</strong> <span>Remote / Hybrid</span></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-3xl rounded-full"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-secondary/5 blur-3xl rounded-full"></div>
      </section>

      {/* Technical Skills Section */}
      <section className="py-24 bg-surface-container-lowest dark:bg-inverse-surface border-y border-outline-variant dark:border-outline/35" id="skills">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white mb-4">Technical Skills</h2>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
              Specializing in the modern web stack and machine learning fundamentals, I leverage high-performance tools to solve complex academic and industrial problems.
            </p>
          </div>

          {/* Bento Grid Layout for Skills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {/* Frontend */}
            <div className="col-span-2 glass-card p-8 rounded-xl hover:shadow-lg dark:hover:bg-on-surface-variant/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary dark:text-[#5c8bee]">layers</span>
                <h3 className="font-headline-md text-on-surface dark:text-white">Frontend Development</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'Next.js', 'Redux'].map(skill => (
                  <span 
                    key={skill} 
                    className="skill-chip px-4 py-2 bg-primary/5 dark:bg-primary/10 text-primary dark:text-[#5c8bee] border border-primary/20 rounded-full font-label-sm text-label-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="col-span-2 glass-card p-8 rounded-xl hover:shadow-lg dark:hover:bg-on-surface-variant/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-secondary dark:text-red-300">database</span>
                <h3 className="font-headline-md text-on-surface dark:text-white">Backend &amp; AI</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'Python', 'Express', 'PostgreSQL', 'TensorFlow', 'GraphQL'].map(skill => (
                  <span 
                    key={skill} 
                    className="skill-chip px-4 py-2 bg-secondary/5 dark:bg-secondary/15 text-secondary dark:text-red-300 border border-secondary/20 rounded-full font-label-sm text-label-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools (Smaller Items) */}
            <div className="col-span-2 md:col-span-1 glass-card p-6 rounded-xl text-center hover:shadow-lg dark:hover:bg-on-surface-variant/10 transition-all duration-300">
              <span className="material-symbols-outlined text-tertiary dark:text-orange-300 mb-3">terminal</span>
              <h4 className="font-label-sm text-on-surface dark:text-white mb-2">DevOps</h4>
              <p className="font-body-md text-on-surface-variant dark:text-gray-300 text-sm">Git, Docker, AWS</p>
            </div>
            <div className="col-span-2 md:col-span-1 glass-card p-6 rounded-xl text-center hover:shadow-lg dark:hover:bg-on-surface-variant/10 transition-all duration-300">
              <span className="material-symbols-outlined text-tertiary dark:text-orange-300 mb-3">brush</span>
              <h4 className="font-label-sm text-on-surface dark:text-white mb-2">Design</h4>
              <p className="font-body-md text-on-surface-variant dark:text-gray-300 text-sm">Figma, UI Design</p>
            </div>
            <div className="col-span-2 md:col-span-1 glass-card p-6 rounded-xl text-center hover:shadow-lg dark:hover:bg-on-surface-variant/10 transition-all duration-300">
              <span className="material-symbols-outlined text-tertiary dark:text-orange-300 mb-3">history_edu</span>
              <h4 className="font-label-sm text-on-surface dark:text-white mb-2">Agile</h4>
              <p className="font-body-md text-on-surface-variant dark:text-gray-300 text-sm">Scrum, Jira</p>
            </div>
            <div className="col-span-2 md:col-span-1 glass-card p-6 rounded-xl text-center hover:shadow-lg dark:hover:bg-on-surface-variant/10 transition-all duration-300">
              <span className="material-symbols-outlined text-tertiary dark:text-orange-300 mb-3">monitoring</span>
              <h4 className="font-label-sm text-on-surface dark:text-white mb-2">Analytics</h4>
              <p className="font-body-md text-on-surface-variant dark:text-gray-300 text-sm">Pandas, NumPy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
