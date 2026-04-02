import { useState } from 'react';
import { Menu, X, ExternalLink, User } from 'lucide-react';

const projects = [
  { name: 'CGPA Predictor', url: 'https://cgpa-predictor-mu.vercel.app/' },
  { name: 'Regression Analysis', url: 'https://reg-ananlysis.vercel.app/' },
  { name: 'PU Papers Finder', url: 'https://pu-eosin.vercel.app/' },
  { name: 'Google Drive Cloner', url: 'https://script.google.com/macros/s/AKfycbxCvap_uQ-PUlJIJ6jK37qXF-UvZvn0IfNJ8JlL0eKViQYHbPaRgtG_RFLY6R6Ax8id/exec' },
  { name: 'Age Calculator', url: 'https://age-calculator-alpha-roan.vercel.app/' },
  { name: 'GitHub Profile', url: 'https://github.com/zain69647/global-visitor-hug' },
  { name: 'Live Visitor Counter', url: 'https://couner.vercel.app/' },
  { name: 'Year Progress Tracker', url: 'https://year-unveiled.vercel.app/' },
  { name: 'PDF Tool', url: 'https://pdf-page-master.vercel.app/' },
  { name: 'Ludo Game', url: 'https://ludo-topaz.vercel.app/' },
  { name: 'Paper Finder', url: 'https://paper-finder.great-site.net/' },
];

const SideDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl hover:bg-primary/10 transition-colors duration-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-base font-bold text-[#0F172A]">My Projects</span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#0F172A]" />
          </button>
        </div>

        {/* Project list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-sm text-[#0F172A] hover:bg-primary/5 hover:text-primary transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" />
              <span>{project.name}</span>
            </a>
          ))}
        </nav>

        {/* About section */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-[#0F172A]">About Me</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Student & developer building free useful web tools by using AI
          </p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
