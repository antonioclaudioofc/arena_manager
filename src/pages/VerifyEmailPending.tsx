import { useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { MailCheck, RotateCw, LogIn } from "lucide-react";
import { useLogin, isUnverifiedEmailError } from "../hooks/use-auth";
import { toast } from "sonner";
import { getErrorMessage } from "../api/http";

type VerifyState = {
  email?: string;
  password?: string;
};

const UNVERIFIED_TOAST_ID = "email-unverified";

export default function VerifyEmailPending() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as VerifyState | null) ?? null;
  const email = state?.email ?? "";
  const password = state?.password ?? "";

  const loginMutation = useLogin();
  const isResending = loginMutation.status === "pending";

  const handleResendEmail = async () => {
    if (!email || !password) {
      toast.error(
        "Para reenviar agora, faça login com seu e-mail e senha na próxima tela.",
      );
      navigate("/login", { state: { email } });
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success("Seu e-mail já está verificado. Você já pode entrar.");
    } catch (err: unknown) {
      if (isUnverifiedEmailError(err)) {
        toast.dismiss(UNVERIFIED_TOAST_ID);
        toast.info("E-mail de verificação reenviado.", {
          id: UNVERIFIED_TOAST_ID,
          duration: 1000,
        });
        return;
      }

      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <MailCheck className="h-7 w-7 text-emerald-600" />
        </div>

        <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-900">
          Valide seu e-mail
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Enviamos um link de validação para o seu e-mail. Confirme sua conta
          para liberar o acesso.
        </p>

        {email ? (
          <p className="mt-2 text-center text-sm text-gray-500">{email}</p>
        ) : null}

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full"
          >
            <RotateCw className="h-4 w-4" />
            {isResending ? "Reenviando..." : "Reenviar e-mail"}
          </Button>

          <Button
            type="button"
            onClick={() => navigate("/login", { state: { email } })}
            className="w-full"
          >
            <LogIn className="h-4 w-4" />
            Fazer login
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-gray-500">
          Se ainda não chegou, verifique a caixa de spam.
        </p>
      </div>
    </section>
  );
}
