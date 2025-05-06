
import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="bg-card/50 backdrop-blur-sm py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>Bora Treinar &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
