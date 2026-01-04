import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Bippo Voice Demo - AI-Powered Voice Interaction",
  description: "Experience natural AI-powered voice conversations with Bippo's advanced voice technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fathom Analytics */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        
        {/* Favicon - Bippo Logo */}
        <link rel="icon" href="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23ef4444'/%3E%3Cstop offset='100%25' stop-color='%23dc2626'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect rx='12' width='64' height='64' fill='url(%23g)'/%3E%3Ctext x='50%25' y='62%25' font-family='Arial, Helvetica, sans-serif' font-weight='700' font-size='34' text-anchor='middle' fill='%23ffffff' dominant-baseline='middle'%3EB%3C/text%3E%3C/svg%3E" />
      </head>
      <body className="bg-gradient-to-br from-red-50 via-white to-blue-50 text-gray-800 min-h-screen">
        {/* Header Navigation */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex mx-auto justify-between items-center py-4 max-w-6xl px-6">
            {/* Bippo Logo */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity"></div>
                
                {/* Logo container */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-2xl">B</span>
                </div>
              </div>
              
              {/* Logo text */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                    Bippo
                  </span>
                  <span className="text-red-500">.</span>
                </h1>
                <span className="text-xs text-gray-600">Voice AI Demo</span>
              </div>
            </a>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                Home
              </a>
              <a href="/#services" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                Services
              </a>
              <a href="/#contact" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                Contact
              </a>
            </nav>
            
            {/* CTA Button */}
            <a href="mailto:contact@bippo.shop?subject=Voice%20Demo%20Inquiry" className="hidden sm:block">
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Get In Touch
              </button>
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Brand */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-lg font-bold">Bippo<span className="text-red-500">.</span></span>
              </div>
              
              {/* Links */}
              <div className="flex items-center space-x-6 text-sm">
                <a href="/" className="text-gray-400 hover:text-red-500 transition-colors">
                  Home
                </a>
                <a href="/#services" className="text-gray-400 hover:text-red-500 transition-colors">
                  Services
                </a>
                <a href="/#about" className="text-gray-400 hover:text-red-500 transition-colors">
                  About
                </a>
                <a href="mailto:contact@bippo.shop" className="text-gray-400 hover:text-red-500 transition-colors">
                  Contact
                </a>
              </div>
              
              {/* Copyright */}
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Bippo. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}