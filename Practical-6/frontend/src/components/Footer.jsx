export default function Footer() {
  return (
    <footer className="w-full py-stack-unit border-t border-outline-variant dark:border-outline/35 bg-surface-container-low dark:bg-inverse-surface/50 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-gutter px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
        <div className="text-center md:text-left">
          <p className="font-headline-md text-headline-md font-bold text-on-surface dark:text-gray-150 mb-2">
            Manthan Joshi
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-400">
            © 2026 Student Professional Portfolio. All rights reserved. Built with academic precision.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-label-sm text-label-sm">
          <a className="text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all" href="#">LinkedIn</a>
          <a className="text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all" href="#">GitHub</a>
          <a className="text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all" href="#">Email</a>
          <a className="text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all" href="#">Curriculum Vitae</a>
        </div>
      </div>
    </footer>
  );
}
