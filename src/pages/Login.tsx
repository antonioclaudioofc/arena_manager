"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/Button";
import { useState } from "react";
import { toast } from "sonner";
import { useContext, useEffect } from "react";
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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Campo obrigatório",
  }),
  password: z.string().min(2, {
    message: "Campo obrigatório",
  }),
});

async function onSubmit(
  values: z.infer<typeof formSchema>,
  setLoading: (v: boolean) => void
) {
  const API_BASE =
    (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";
  setLoading(true);
  try {
    const body = new URLSearchParams();
    body.append("username", values.username);
    body.append("password", values.password);

    const res = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const data = await res.json();
    // data should contain access_token and token_type (bearer)
    toast.success("Login realizado com sucesso");
    console.log("token", data);
    return data;
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Erro no login");
    return false;
  } finally {
    setLoading(false);
  }
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth?.token) {
      // already logged in -> redirect
      window.location.href = "/";
    }
  }, [auth?.token]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

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
          <h2 className="text-2xl text-center">Entrar na sua conta</h2>
          <p className="text-center text-gray-600">
            Preencha as informações abaixo para entrar na sua conta.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              const data = await onSubmit(values, setLoading);
              if (data?.access_token) {
                // use auth context to store token
                try {
                  auth.login(data.access_token);
                } catch {
                  localStorage.setItem("access_token", data.access_token);
                }
                localStorage.setItem("token_type", data.token_type || "bearer");
                window.location.href = "/";
              }
            })}
            className="space-y-4"
          >
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
                    <Input placeholder="Insira sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <a
              className="block text-right text-green-700 cursor-pointer transition-all hover:text-green-600"
              href="/forgot"
            >
              Esqueceu a senha?
            </a>

            <div>
              <Button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "var(--brand-600)" }}
                className="w-full"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </Form>
        <a
          href="/register"
          className="mt-4 text-center text-sm cursor-pointer hover:opacity-75 transition-opacity block "
        >
          <span>Não tem conta? </span>
          <span className="text-green-700 underline">Criar conta</span>
        </a>
      </div>
    </section>
  );
}
