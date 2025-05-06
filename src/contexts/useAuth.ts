import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Mantemos a referência ao contexto

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};