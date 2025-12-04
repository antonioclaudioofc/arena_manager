export default function AdminSchedules() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Horários</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          + Novo Horário
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">
          Configure os horários disponíveis para cada quadra.
        </p>
        <p className="text-gray-400 text-sm mt-2">Em desenvolvimento...</p>
      </div>
    </div>
  );
}
