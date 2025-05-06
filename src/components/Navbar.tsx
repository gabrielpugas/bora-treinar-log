import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LoginModal from "@/components/LoginModal"; // Importando o modal de login

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/70 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-workout animate-pulse-slow">
              Bora Treinar
            </span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link 
            to="/gym" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/gym" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Academia
          </Link>
          <Link 
            to="/home" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/home" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Em Casa
          </Link>
          
          {/* Botão de Login - Abre Modal */}
          <LoginModal />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;