"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/Button";
import { useState, useContext } from "react";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/Form";
import { Input } from "../components/Input";
import logo from "../assets/logo.svg";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router";

const formSchema = z.object({
  username: z.string().min(2, "Campo obrigatório"),
  password: z.string().min(2, "Campo obrigatório"),
});

type LoginSchema = z.infer<typeof formSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleDemoLogin = async (username: string, password: string) => {
    setLoading(true);

    try {
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao entrar");

        return;
      }

      toast.success("Login realizado com sucesso!");

      auth.login(data.access_token);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: LoginSchema) => {
    await handleDemoLogin(values.username, values.password);
  };

  return (
    <section className="w-full min-h-screen bg-green-700 flex justify-center items-center p-8">
      <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-md shrink-0">
        <Button
          className="w-max p-3"
          variant={"secondary"}
          onClick={() => navigate("/")}
        >
          <MoveLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Button>
        <div className="my-8">
          <img
            src={logo}
            className="w-40 h-40 object-fill mx-auto"
            alt="Logo"
          />
          <h2 className="text-2xl text-center">Entrar na sua conta</h2>
          <p className="text-center text-gray-600">
            Preencha as informações abaixo para entrar na sua conta.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira seu username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Insira sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>

        <a
          href="/register"
          className="mt-4 text-center text-sm cursor-pointer hover:opacity-75 transition-opacity block "
        >
          <span>Não possui conta? </span>
          <span className="text-green-700 underline">Criar uma conta</span>
        </a>

        <div className="mt-8 pt-8 border-t border-gray-300">
          <p className="text-center text-gray-600 text-sm mb-4">
            Ou teste com credenciais de demo:
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin("arenamanager", "123456")}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? "Entrando..." : "Demo Admin"}
            </button>
            <button
              onClick={() => handleDemoLogin("user", "123456")}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? "Entrando..." : "Demo User"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
