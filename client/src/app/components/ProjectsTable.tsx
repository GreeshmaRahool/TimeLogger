import React from "react";
import { Project } from "../types/types";
import { formattedDate } from "../utils/dateutils";

interface ProjectTableProps {
    data: Project[];
    onLogTime: (projectId: number, projectName: string) => void;
    onViewLogs: (projectId: number, projectName: string) => void;
}
  
export default function ProjectsTable( { data, onLogTime, onViewLogs } : ProjectTableProps) {
    return (
        <table className="table-fixed w-full">
            <thead className="bg-gray-200">
                <tr>
                    <th className="border px-4 py-2 w-12">#</th>
                    <th className="border px-4 py-2">Project Name</th>
                    <th className="border px-4 py-2">Deadline</th>
                    <th className="border px-4 py-2">Log Time</th>
                    <th className="border px-4 py-2">Time Logs</th>
                </tr>
            </thead>
            <tbody>
                {data.map((project) => (
                    <tr key={project.id }>
                        <td className="border px-4 py-2 w-12">{project.id}</td>
                        <td className="border px-4 py-2">{project.name}</td>
                        <td className="border px-4 py-2">
                            {
                                formattedDate(project.deadline)
                            }
                        </td>
                        <td className="border px-4 py-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                onClick={() => { onLogTime(project.id, project.name) } }
                            > + Log Time </button>
                        </td>
                        <td className="border px-4 py-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                    onClick={() => { onViewLogs(project.id, project.name) } }
                                > ⏳ View Logs </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
