export default function Home() {
  return (
    <section>
      <div className="bg-gray-50 border border-gray-200 mt-6 rounded-md text-center py-3">
        <h2 className="text-4xl font-bold mb-4">Agende seu Horário</h2>
        <p className="text-lg font-medium text-gray-700">Novembro/Dezembro 2025</p>
      </div>
      <div className="border border-gray-200 shadow bg-blue-50">
        <div className="flex gap-6">
          <div className="w-40 h-40 bg-black">
            as
          </div>
          <div>
            <h3 className="text-xl font-medium">Arena A</h3>
            <h4 className="text-base text-blue-600">Futebol</h4>
            <p className="text-sm text-gray-600">Caxias, Maranhão</p>
          </div>
        </div>
      </div>
    </section>
  );
}
