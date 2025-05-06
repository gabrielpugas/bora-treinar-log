import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao obter sessão:", error.message);
        setIsLoading(false);
        return;
      }

      const sessionUser = data.session?.user;
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
          role: sessionUser.user_metadata?.role || "user",
        });
      }

      setIsLoading(false);
    };

    fetchSession();

    // Monitorar mudanças na sessão do usuário
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || "user",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe(); // Remover listener ao desmontar
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      if (!email.trim() || !password.trim()) {
        console.error("Erro: Campos de email e senha não podem estar vazios.");
        return;
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
      if (error || !data.session) {
        console.error("Erro ao logar:", error?.message || "Credenciais inválidas");
        return;
      }
  
      const sessionUser = data.session.user; 
  
      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
        role: sessionUser.user_metadata?.role || "user",
      });

      console.log("Login realizado com sucesso!");
    } catch (err) {
      console.error("Erro inesperado:", err);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log("Logout realizado com sucesso!");
    } catch (err) {
      console.error("Erro ao tentar logout:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }; // Apenas exportamos o contexto
