"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/Button";
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
import {
  MoveLeft,
  UserPlus,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

const formSchema = z
  .object({
    email: z.string().email("E-mail inválido"),
    username: z.string().min(2, "Campo obrigatório"),
    name: z.string().min(2, "Campo obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirm_password: z
      .string()
      .min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas não conferem",
  });

type AuthSchema = z.infer<typeof formSchema>;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");

  useEffect(() => {
    if (auth.token) {
      navigate("/");
    }
  }, [auth.token, navigate]);

  const form = useForm<AuthSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      name: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: AuthSchema) => {
    const API_BASE = import.meta.env.VITE_API_BASE;
    setLoading(true);

    try {
      const { confirm_password, ...rest } = values;
      const payload = { ...rest };

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao registar");
        return;
      }

      try {
        const loginBody = new URLSearchParams();
        loginBody.append("username", rest.username || "");
        loginBody.append("password", rest.password || "");

        const tokenResponse = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: loginBody.toString(),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          toast.success("Conta criada. Por favor faça login.");
          navigate("/login");
          return;
        }

        if (tokenData?.access_token) {
          try {
            auth.login(tokenData.access_token);
          } catch {
            localStorage.setItem("access_token", tokenData.access_token);
          }
        }

        toast.success("Registrado e autenticado com sucesso!");

        if (roleParam === "owner") {
          navigate("/owner/arenas?newArena=true");
        } else {
          navigate("/");
        }
      } catch (loginErr: any) {
        console.error("Auto-login falhou:", loginErr);
        toast.success("Conta criada. Por favor faça login.");
        navigate("/login");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-2 mb-6 md:mb-8 font-semibold transition hover:opacity-70 text-emerald-600"
          >
            <MoveLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div className="text-center mb-8 md:mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg bg-emerald-100">
                {roleParam === "owner" ? (
                  <Building2 size={32} className="text-emerald-600" />
                ) : (
                  <UserPlus size={32} className="text-emerald-600" />
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              {roleParam === "owner" ? "Criar Arena" : "Criar Conta"}
            </h1>
            <p className="text-gray-500">
              {roleParam === "owner"
                ? "Cadastre-se como proprietário para gerenciar suas arenas"
                : "Junte-se a nós e comece a reservar suas arenas favoritas"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Seu Nome Completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Usuário
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="seu_usuario" {...field} />
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
                          placeholder="Mínimo 6 caracteres"
                          {...field}
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 transition hover:opacity-70 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-semibold">
                      Confirmar Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          {...field}
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 transition hover:opacity-70 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
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
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-gray-500 mb-3 font-medium">
              Já possui uma conta?
            </p>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>

      {/* Lado DIREITO - Propaganda FIXA (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 sticky top-0 h-screen bg-emerald-600">
        <div className="text-center text-white max-w-md">
          <img
            src={logo}
            className="w-24 md:w-32 h-24 md:h-32 mx-auto mb-6"
            alt="Logo"
          />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {roleParam === "owner"
              ? "Crie Sua Arena"
              : "Faça Parte da Comunidade"}
          </h2>
          <p className="text-base md:text-lg opacity-90 mb-8">
            {roleParam === "owner"
              ? "Comece a gerenciar suas quadras e aumente seus lucros"
              : "Reserve as melhores arenas esportivas da sua cidade"}
          </p>
          <div className="space-y-4">
            {roleParam === "owner" ? (
              <>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <span>Gerencie suas quadras</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <span>Aumente sua receita</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <span>Controle reservas</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <span>Busque arenas próximas</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <span>Acesse seu histórico</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <span>Reserve com facilidade</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
