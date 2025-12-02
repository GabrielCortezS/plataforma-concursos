import { AdminCard } from "../components";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Visão Geral</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard title="Concursos Ativos" value="12" icon="📝" />
        <AdminCard title="Inscrições" value="1.248" icon="📑" />
        <AdminCard title="Cargos Cadastrados" value="38" icon="💼" />
      </div>
    </div>
  );
}
