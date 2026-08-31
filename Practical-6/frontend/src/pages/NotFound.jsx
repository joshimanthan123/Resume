import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-background dark:bg-inverse-surface/10 min-h-[85vh] flex items-center justify-center py-24 px-margin-mobile md:px-margin-desktop duration-300">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="text-primary dark:text-[#5c8bee] animate-float">
          <span className="material-symbols-outlined text-[96px]">error</span>
        </div>
        
        <h1 className="font-display-lg text-[64px] text-on-background dark:text-white font-black tracking-tighter">
          404
        </h1>
        
        <h2 className="font-headline-md text-headline-md text-on-surface dark:text-gray-200 font-bold">
          Page Not Found
        </h2>
        
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-sm text-sm transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
