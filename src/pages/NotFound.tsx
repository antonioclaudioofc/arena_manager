export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-gray-700 text-lg">Página não encontrada.</p>

      <a
        href="/"
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}
