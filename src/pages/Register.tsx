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
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router";

const formSchema = z
  .object({
    email: z.string().min(2, {
      message: "Campo obrigatório",
    }),
    username: z.string().min(2, {
      message: "Campo obrigatório",
    }),
    first_name: z.string().min(2, {
      message: "Campo obrigatório",
    }),
    last_name: z.string().min(2, { message: "Campo obrigatório" }),
    password: z.string().min(6, {
      message: "A senha deve ter no mínimo 6 caracteres",
    }),
    confirm_password: z.string().min(6, {
      message: "A confirmação de senha deve ter no mínimo 6 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas não conferem",
  });

type AuthSchema = z.infer<typeof formSchema>;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.token) {
      navigate("/");
    }
  }, [auth?.token]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: AuthSchema) => {
    const API_BASE = "http://localhost:8000";
    setLoading(true);

    try {
      const { confirm_password, ...rest } = values as any;
      const payload = { ...rest, role: "user" };

      const res = await fetch(`${API_BASE}/auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar");
      }

      try {
        const loginBody = new URLSearchParams();
        loginBody.append("username", rest.username || "");
        loginBody.append("password", rest.password || "");

        const tokenRes = await fetch(`${API_BASE}/auth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: loginBody.toString(),
        });

        if (!tokenRes.ok) {
          toast.success("Conta criada. Por favor faça login.");
          navigate("/login");
          return;
        }

        const tokenData = await tokenRes.json();
        if (tokenData?.access_token) {
          try {
            auth.login(tokenData.access_token);
          } catch {
            localStorage.setItem("access_token", tokenData.access_token);
          }
          localStorage.setItem("token_type", tokenData.token_type || "bearer");
        }

        toast.success("Registrado e autenticado com sucesso!");
        navigate("/");
      } catch (loginErr: any) {
        console.error("Auto-login falhou:", loginErr);
        toast.success("Conta criada. Por favor faça login.");
        navigate("/login");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro no registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-green-700 flex justify-center items-center p-8">
      <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-md shrink-0">
        <a
          href="/"
          className="p-3 items-center flex gap-3 border border-gray-400 w-max rounded-lg text-green-700"
        >
          <MoveLeft className="w-6 h-6" />
          <span className="text-base">Voltar</span>
        </a>
        <div className="mb-8">
          <img
            src={logo}
            className="w-40 h-40 object-fill mx-auto"
            alt="Logo"
          />
          <h2 className="text-2xl text-center">Criar sua conta</h2>
          <p className="text-center text-gray-600">
            Preencha as informações abaixo para criar sua conta.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Insira seu e-mail"
                      {...field}
                    />
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
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira seu primeiro nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Insira seu sobrenome" {...field} />
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
                      placeholder="Insira seu senha"
                      {...field}
                    />
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
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirme sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "var(--brand-600)" }}
                className="w-full"
              >
                {loading ? "Cadastrando..." : "Criar conta"}
              </Button>
            </div>
          </form>
        </Form>
        <a
          href="/login"
          className="mt-4 text-center text-sm cursor-pointer hover:opacity-75 transition-opacity block "
        >
          <span>Já possui conta? </span>
          <span className="text-green-700 underline">Entrar na conta</span>
        </a>
      </div>
    </section>
  );
}
