export default function AdminConfig() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Configurações Gerais
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Arena
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Arena Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de Contato
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="contato@arena.com"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
