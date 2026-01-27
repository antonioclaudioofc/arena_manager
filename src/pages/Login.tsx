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
import { MoveLeft, LogIn, Zap, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";

const formSchema = z.object({
  username: z.string().min(2, "Campo obrigatório"),
  password: z.string().min(2, "Campo obrigatório"),
});

type LoginSchema = z.infer<typeof formSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <section className="w-full min-h-screen flex bg-gray-50">
      {/* Lado Esquerdo - Decorativo FIXO (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 sticky top-0 h-screen bg-emerald-700">
        <div className="text-center text-white max-w-md">
          <img src={logo} className="w-24 md:w-32 h-24 md:h-32 mx-auto mb-6" alt="Logo" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Arena Manager</h2>
          <p className="text-base md:text-lg opacity-90 mb-8">
            Sua plataforma completa para gerenciar e agendar arenas esportivas
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <span>Buscar e reservar arenas</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <span>Gerenciar seus horários</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <span>Aumentar seus lucros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário com SCROLL */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Voltar */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 md:mb-8 font-semibold transition hover:opacity-70 text-emerald-600"
          >
            <MoveLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg bg-emerald-100">
                <LogIn size={32} className="text-emerald-600" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Entrar
            </h1>
            <p className="text-gray-500">
              Bem-vindo de volta! Faça login na sua conta
            </p>
          </div>

          {/* Formulário */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Nome de Usuário
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome de usuário"
                        {...field}
                      />
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
                    <FormLabel className="text-gray-900 font-semibold">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          {...field}
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 transition hover:opacity-70 text-gray-500"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                variant="default"
                className="w-full"
              >
                {loading ? "Entrando..." : "Entrar na Conta"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Demo Login */}
          <div className="mb-8">
            <p className="text-gray-500 text-sm text-center mb-3">
              Teste com credenciais de demo:
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => handleDemoLogin("arenamanager", "123456")}
                disabled={loading}
                variant="outline"
                className="w-full bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                <Zap size={16} className="mr-2" />
                Demo Admin
              </Button>
              <Button
                onClick={() => handleDemoLogin("user", "123456")}
                disabled={loading}
                variant="outline"
                className="w-full bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
              >
                <Zap size={16} className="mr-2" />
                Demo Cliente
              </Button>
            </div>
          </div>

          {/* Link para Registro - MELHORADO */}
          <div className="text-center p-4 md:p-6 rounded-lg bg-white border-2 border-gray-200">
            <p className="text-gray-500 mb-3 font-medium">
              Não possui uma conta?
            </p>
            <Button
              onClick={() => navigate("/register")}
              variant="default"
              className="w-full"
            >
              Criar Conta Grátis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
