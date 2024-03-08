import React from "react";
import { TimeLogResponse } from "../types/types";
import { formattedDate } from "../utils/dateutils";
  
export default function TimeLogsTable( { data } : { data: TimeLogResponse[]}) {
    return (
        <div className="h-64 overflow-y-auto"> 
            <table className="table-fixed w-full">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border px-4 py-2 w-12">#</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Time (in minutes)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((project) => (
                        <tr key={project.id }>
                            <td className="border px-4 py-2 w-12">{project.id}</td>
                            <td className="border px-4 py-2">{project.description}</td>
                            <td className="border px-4 py-2">{formattedDate(project.date)}</td>
                            <td className="border px-4 py-2">{project.durationInMinutes}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}
