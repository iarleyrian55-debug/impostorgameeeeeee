import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onBack, action }) => {
  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col p-4 max-w-md mx-auto relative overflow-hidden">
      <header className="flex items-center justify-between mb-6 h-16 z-10">
        <div className="w-10">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full bg-zinc-800 text-yellow-400 hover:bg-zinc-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
        </div>
        
        {title && (
          <h1 className="text-xl font-black uppercase text-center tracking-wider text-yellow-400 truncate max-w-[200px]">
            {title}
          </h1>
        )}

        <div className="w-10 flex justify-end">
          {action}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-20 -left-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 -right-20 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};