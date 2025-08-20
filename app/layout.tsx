import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Adymade Voice Demo",
  description: "AI-powered voice interaction demonstration by Adymade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
        <div className="flex mx-auto justify-between items-center my-6 max-w-[1206px] px-4">
          {/* Adymade Logo Text */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Adymade
            </h1>
          </div>
          
          {/* <a href="mailto:hello@adymade.com?subject=Voice%20Demo%20Inquiry" >
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get In Touch
            </button>
          </a> */}
        </div>
        {children}
      </body>
    </html>
  );
}