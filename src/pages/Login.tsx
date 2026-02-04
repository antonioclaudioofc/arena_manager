"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/Button";
import { useContext, useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/Form";
import { Navigate } from "react-router";
import { useLogin } from "../hooks/use-auth";
import { Input } from "../components/Input";
import logo from "../assets/logo.svg";
import { MoveLeft, LogIn, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import { UserLoginSchema } from "../schemas/user.schemas";
import { getErrorMessage } from "../api/http";

type LoginSchema = z.infer<typeof UserLoginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useLogin();
  const loading = loginMutation.status === "pending";

  if (auth.token) return <Navigate to="/" replace />;

  const handleDemoLogin = async (username: string, password: string) => {
    try {
      const data = await loginMutation.mutateAsync({ username, password });

      if (!data || !data.access_token) {
        toast.error("Erro ao entrar");
        return;
      }

      toast.success("Login realizado com sucesso!");
      await auth.login(data.access_token);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(getErrorMessage(err));
    }
  };

  const onSubmit = async (values: LoginSchema) => {
    await handleDemoLogin(values.username, values.password);
  };

  return (
    <section className="w-full min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 sticky top-0 h-screen bg-emerald-700">
        <div className="text-center text-white max-w-md">
          <img
            src={logo}
            className="w-24 md:w-32 h-24 md:h-32 mx-auto mb-6"
            alt="Logo"
          />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Arena Manager</h2>
          <p className="text-base md:text-lg opacity-90 mb-8">
            Sua plataforma completa para gerenciar e agendar arenas esportivas
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                <CheckCircle2 className="text-white w-5 h-5" />
              </div>
              <span>Buscar e reservar arenas</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                <CheckCircle2 className="text-white h-5 w-5" />
              </div>
              <span>Gerenciar seus horários</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                <CheckCircle2 className="text-white h-5 w-5" />
              </div>
              <span>Aumentar seus lucros</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 md:mb-8 font-semibold cursor-pointer transition hover:opacity-70 text-emerald-600"
          >
            <MoveLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div className="text-center mb-8 md:mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg bg-emerald-100">
                <LogIn className="text-emerald-600 h-8 w-8" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Entrar
            </h1>
            <p className="text-gray-500">
              Bem-vindo de volta! Faça login na sua conta
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mb-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Nome de Usuário
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome de usuário" {...field} />
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
                          className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 transition hover:opacity-70 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={loading} className="w-full p-3">
                {loading ? "Entrando..." : "Entrar na Conta"}
              </Button>
            </form>
          </Form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="mb-8">
            <p className="text-gray-500 text-sm text-center mb-3">
              Teste com credenciais de demo:
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => handleDemoLogin("owner", "123456")}
                disabled={loading}
                variant="outline"
                className="w-full bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                Demo Dono
              </Button>
              <Button
                onClick={() => handleDemoLogin("client", "123456")}
                disabled={loading}
                variant="outline"
                className="w-full bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
              >
                Demo Cliente
              </Button>
            </div>
          </div>

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
