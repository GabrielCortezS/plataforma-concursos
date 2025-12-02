export default function AdminCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg flex items-center gap-4">
      <div className="text-3xl">{icon}</div>

      <div>
        <h3 className="text-gray-600">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
