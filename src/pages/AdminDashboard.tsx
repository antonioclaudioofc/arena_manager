export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Administrativo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">
            Total de Quadras
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">8</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Reservas Hoje</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Usuários Ativos</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">47</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Receita Mensal</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">R$ 8.5k</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Reservas Recentes
        </h2>
        <p className="text-gray-500">Em desenvolvimento...</p>
      </div>
    </div>
  );
}
