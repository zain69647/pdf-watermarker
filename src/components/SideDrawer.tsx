import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, GraduationCap, BarChart3, FileText, HardDrive, Calculator, Eye, Clock, FileDown, Gamepad2, Search, User, Wrench, Sparkles, Zap } from 'lucide-react';

const sections = [
  {
    label: 'Student Tools',
    icon: GraduationCap,
    items: [
      { name: 'CGPA Predictor', url: 'https://cgpa-predictor-mu.vercel.app/', icon: BarChart3 },
      { name: 'Regression Analysis', url: 'https://reg-ananlysis.vercel.app/', icon: BarChart3 },
      { name: 'PU Papers Finder', url: 'https://pu-eosin.vercel.app/', icon: FileText },
      { name: 'Paper Finder', url: 'https://paper-finder.great-site.net/', icon: Search },
    ],
  },
  {
    label: 'Utilities',
    icon: Wrench,
    items: [
      { name: 'Google Drive Cloner', url: 'https://script.google.com/macros/s/AKfycbxCvap_uQ-PUlJIJ6jK37qXF-UvZvn0IfNJ8JlL0eKViQYHbPaRgtG_RFLY6R6Ax8id/exec', icon: HardDrive },
      { name: 'Age Calculator', url: 'https://age-calculator-alpha-roan.vercel.app/', icon: Calculator },
      { name: 'Live Visitor Counter', url: 'https://couner.vercel.app/', icon: Eye },
      { name: 'Year Progress Tracker', url: 'https://year-unveiled.vercel.app/', icon: Clock },
      { name: 'PDF Tool', url: 'https://pdf-page-master.vercel.app/', icon: FileDown },
    ],
  },
  {
    label: 'Fun',
    icon: Sparkles,
    items: [
      { name: 'Ludo Game', url: 'https://ludo-topaz.vercel.app/', icon: Gamepad2 },
    ],
  },
];

const SideDrawer = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const drawerContent = (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-[9999] h-screen flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '85%', maxWidth: 320, height: '100dvh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-base font-bold text-[#0F172A]">My Tools</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#0F172A]" />
          </button>
        </div>

        {/* Sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {sections.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="flex items-center gap-2 px-2 mb-1.5">
                <section.icon className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  {section.label}
                </span>
              </div>
              {section.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#0F172A] hover:bg-[#F1F5F9] hover:translate-x-1 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <item.icon className="w-4 h-4 text-[#64748B] group-hover:text-blue-600 transition-colors duration-200" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* About section */}
        <div className="border-t border-[#E2E8F0] px-5 py-4 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-[#0F172A]">About Me</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Building useful tools for students 🚀
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl hover:bg-primary/10 transition-colors duration-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>
      {createPortal(drawerContent, document.body)}
    </>
  );
};

export default SideDrawer;
