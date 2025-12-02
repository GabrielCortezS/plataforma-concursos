export default function AdminTable({ columns, children }) {
  return (
    <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="text-left px-4 py-3 font-medium text-gray-700"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
}
