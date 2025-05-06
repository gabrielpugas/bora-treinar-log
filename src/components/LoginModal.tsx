import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as Dialog from "@radix-ui/react-dialog"; // Importando corretamente

const LoginModal = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn">Login</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="modal bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">Faça login</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Insira seu email e senha para acessar o sistema.
          </Dialog.Description>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex justify-end mt-4">
            <Dialog.Close className="mr-2">Cancelar</Dialog.Close>
            <button onClick={handleLogin}>Entrar</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginModal;