import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as Dialog from "@radix-ui/react-dialog";

const LoginModal = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Os campos de email e senha não podem estar vazios.");
      return;
    }

    try {
      await login(email, password);
      console.log("Login realizado com sucesso!");
      setErrorMessage(""); // Limpa mensagem de erro ao logar
      (document.querySelector("#closeModalBtn") as HTMLButtonElement)?.click(); // Fecha modal
    } catch (err) {
      console.error("Erro ao tentar login:", err);
      setErrorMessage("Falha ao autenticar. Verifique suas credenciais.");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition">
        Login
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-sm transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold text-gray-500">Faça login</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Insira seu email e senha para acessar o sistema.
          </Dialog.Description>

          {errorMessage && (
            <p className="text-sm text-red-500 mb-3">{errorMessage}</p>
          )}

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full text-black placeholder-gray-500"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full text-black placeholder-gray-500"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Dialog.Close id="closeModalBtn" className="px-4 py-2 text-gray-600 hover:text-gray-800 transition">
              Cancelar
            </Dialog.Close>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition"
            >
              Entrar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginModal;