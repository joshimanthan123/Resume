import { useState, useEffect } from 'react';

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const GITHUB_USERNAME = 'google';

  const fetchRepos = () => {
    setLoading(true);
    setError(null);
    // Dynamic fetch of repositories sorted by updated
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch repositories (${res.status} ${res.statusText})`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error('Invalid data format received from GitHub API.');
        }
      })
      .catch((err) => {
        setError(err.message || 'An unknown network error occurred.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) => {
    const nameMatch = repo.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = repo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || descMatch;
  });

  return (
    <div className="bg-background dark:bg-inverse-surface/10 py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto duration-300 min-h-[85vh]">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-xl">
          <h2 className="font-headline-md text-[32px] md:text-[40px] text-on-surface dark:text-white mb-4 font-bold">
            Academic & Open Source Projects
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
            A dynamic feed of repositories directly retrieved from GitHub highlighting my recent contributions.
          </p>
        </div>
        <a 
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary dark:text-[#5c8bee] font-label-sm text-label-sm flex items-center gap-2 hover:underline group"
        >
          View GitHub profile 
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            open_in_new
          </span>
        </a>
      </div>

      {/* Search Input Bar - Beautiful styling matching Contact.jsx */}
      <div className="mb-10 max-w-md">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-on-surface-variant dark:text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search repositories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white dark:bg-inverse-surface border border-outline-variant dark:border-outline/40 text-on-surface dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white transition-colors"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Conditional Rendering Blocks */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
          <p className="text-on-surface-variant dark:text-gray-300 font-medium animate-pulse">
            Fetching GitHub repositories...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center py-16 space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 text-red-650 dark:text-red-400 rounded-full flex items-center justify-center shadow-inner animate-bounce">
            <span className="material-symbols-outlined text-[36px]">error</span>
          </div>
          <div>
            <h3 className="font-headline-md text-on-surface dark:text-white mb-2 font-bold text-2xl">
              Failed to Load Projects
            </h3>
            <p className="text-sm text-on-surface-variant dark:text-gray-350 font-mono bg-surface-container-low dark:bg-inverse-surface/50 p-4 rounded-xl border border-outline-variant dark:border-outline/20 break-words max-w-full leading-relaxed">
              {error}
            </p>
          </div>
          <button
            onClick={fetchRepos}
            className="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-sm text-sm transition-all shadow-md flex items-center justify-center gap-2 mx-auto btn-pulse cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry Fetch
          </button>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low dark:bg-inverse-surface/30 rounded-2xl border border-dashed border-outline-variant dark:border-outline/25">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant dark:text-gray-500 mb-3 block">
            folder_off
          </span>
          <p className="text-on-surface-variant dark:text-gray-300 text-sm">
            No projects match "{searchTerm}". Try another search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal active">
          {filteredRepos.map((repo) => {
            // Select gradient dynamically depending on string chars code
            const colors = [
              "from-blue-500 to-indigo-600",
              "from-purple-500 to-pink-600",
              "from-emerald-500 to-teal-600",
              "from-amber-500 to-orange-600",
              "from-cyan-500 to-blue-600",
              "from-[#4648d4] to-[#6063ee]",
            ];
            const colorIndex = Math.abs(repo.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
            const gradientColor = colors[colorIndex];

            // Dynamically assign icons based on major programming languages / frameworks
            let iconName = "code";
            const lang = repo.language?.toLowerCase() || "";
            if (lang.includes("javascript")) {
              iconName = "settings_input_composite";
            } else if (lang.includes("typescript")) {
              iconName = "javascript";
            } else if (lang.includes("python")) {
              iconName = "terminal";
            } else if (lang.includes("html") || lang.includes("css")) {
              iconName = "html";
            } else if (lang.includes("java") || lang.includes("c#") || lang.includes("cpp")) {
              iconName = "memory";
            } else if (lang.includes("rust") || lang.includes("go")) {
              iconName = "build";
            }

            return (
              <div 
                key={repo.id} 
                className="project-card group relative overflow-hidden rounded-xl border border-outline-variant dark:border-outline/35 bg-white dark:bg-inverse-surface shadow-sm transition-all duration-305 flex flex-col justify-between"
              >
                <div>
                  {/* Card Visual Header */}
                  <div className={`aspect-video w-full bg-gradient-to-br ${gradientColor} flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.01]`}>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl relative animate-float">
                      <span className="material-symbols-outlined text-[36px]">{iconName}</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-8 pb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.language && (
                        <span className="px-3 py-1 bg-primary/5 dark:bg-primary/20 text-primary dark:text-[#5c8bee] text-[12px] font-bold rounded-full">
                          {repo.language}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[12px] font-bold rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm leading-none text-yellow-500">star</span>
                        {repo.stargazers_count}
                      </span>
                      {repo.forks_count > 0 && (
                        <span className="px-3 py-1 bg-gray-500/10 text-gray-600 dark:text-gray-300 text-[12px] font-bold rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm leading-none">fork_right</span>
                          {repo.forks_count}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-headline-md text-on-surface dark:text-white mb-2 font-bold group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors text-xl truncate" title={repo.name}>
                      {repo.name}
                    </h3>
                    
                    <p className="font-body-md text-on-surface-variant dark:text-gray-300 mb-4 h-12 line-clamp-2 text-sm" title={repo.description || "No description provided."}>
                      {repo.description || "No description provided. Click Source to view repository files."}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <div className="flex items-center gap-6 border-t border-outline-variant/40 dark:border-outline/20 pt-4 mt-2">
                    {repo.homepage && (
                      <a 
                        href={repo.homepage} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-[#5c8bee] font-label-sm text-label-sm flex items-center gap-1 group/link hover:underline"
                      >
                        Live Demo 
                        <span className="material-symbols-outlined text-[16px] group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform">
                          north_east
                        </span>
                      </a>
                    )}
                    <a 
                      href={repo.html_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant dark:text-gray-400 font-label-sm text-label-sm flex items-center gap-1 hover:text-on-surface dark:hover:text-white hover:underline"
                    >
                      Source 
                      <span className="material-symbols-outlined text-[16px]">code</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
