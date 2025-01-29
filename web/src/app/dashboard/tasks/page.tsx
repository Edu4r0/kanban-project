import { KanbanBoard } from "@/components/kaban-board";
import DashboardSection from "@/components/layout/dashboard-section";

function DashboardTasksPage() {
  return (
    <>
      <DashboardSection
        title="🌱 Tareas"
        description="Aquí encontrarás todas tus tareas, puedes crear nuevas, editar o eliminar según tus necesidades."
      />
      <KanbanBoard />
    </>
  );
}

export default DashboardTasksPage;
