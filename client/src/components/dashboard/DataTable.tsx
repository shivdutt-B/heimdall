import React from "react";

interface Props {
  className?: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
  status: "in_process" | "done";
  target: number;
  limit: number;
  reviewer: string;
}

const data: Document[] = [
  {
    id: "1",
    title: "Cover page",
    type: "Cover page",
    status: "in_process",
    target: 18,
    limit: 5,
    reviewer: "Eddie Lake",
  },
  {
    id: "2",
    title: "Table of contents",
    type: "Table of contents",
    status: "done",
    target: 29,
    limit: 24,
    reviewer: "Eddie Lake",
  },
];

export const DataTable: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900/50 ${className}`}
    >
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Header
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Section Type
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Target
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Limit
              </th>
              <th className="h-12 px-4 text-left align-middle text-gray-400 font-medium">
                Reviewer
              </th>
              <th className="h-12 w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-800">
                <td className="p-4 align-middle text-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 bg-gray-800"
                    />
                    {row.title}
                  </div>
                </td>
                <td className="p-4 align-middle text-gray-300">{row.type}</td>
                <td className="p-4 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        row.status === "done"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }
                    `}
                  >
                    {row.status === "done" ? "Done" : "In Process"}
                  </span>
                </td>
                <td className="p-4 align-middle text-gray-300">{row.target}</td>
                <td className="p-4 align-middle text-gray-300">{row.limit}</td>
                <td className="p-4 align-middle text-gray-300">
                  {row.reviewer}
                </td>
                <td className="p-4 align-middle">
                  <button className="rounded-lg p-2 hover:bg-gray-800">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
