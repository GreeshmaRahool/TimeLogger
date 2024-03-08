import React, { useEffect, useState } from "react";
import ProjectsTable from "../components/ProjectsTable";
import { getAll } from "../api/projects";
import AddEntry from './AddEntry'; // Adjust the import path as necessary
import AddTimeLog from "./AddTimeLog";
import ViewLogs from "./ViewLogs";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [logProjectId, setLogProjectId] = useState(0);
    const [logProjectName, setLogProjectName] = useState('');


    const getProjects = async (sorted = false) => {
        const projects = await getAll(sorted);
        setProjects(projects);
    };
    useEffect(() => {
        getProjects();

    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => setIsOpen(!isOpen);

    const [isLogsOpen, setIsLogsOpen] = useState(false);
    // const toggleLogsDialog = () => setIsLogsOpen(!isLogsOpen);

    const [isNewLogsOpen, setIsNewLogsOpen] = useState(false);
    // const toggleNewLogsDialog = () => setIsNewLogsOpen(!isNewLogsOpen);

    return (
        <>
            <div className="flex items-center my-6">
                <div className="w-1/2 flex gap-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        type="button"
                        onClick={toggleDialog}
                    >
                        + New Project
                    </button>

                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        onClick={() => getProjects(true)}
                    >
                        ↓ Sort by Deadline
                    </button>
                </div>

                <div className="w-1/2 flex justify-end">
                    <form>
                        <input
                            className="border rounded-full py-2 px-4"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white rounded-full py-2 px-4 ml-2"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
            <AddEntry
                isOpen={isOpen} setIsOpen={setIsOpen}
                onNewProject={getProjects} />
            <AddTimeLog isOpen={isNewLogsOpen} setIsOpen={setIsNewLogsOpen}
                projectId={logProjectId} projectName={logProjectName} />
            <ViewLogs isOpen={isLogsOpen} setIsOpen={setIsLogsOpen}
                projectId={logProjectId} projectName={logProjectName} />
            <ProjectsTable
                data={projects}
                onLogTime={(projectId, projectName) => {
                    setIsNewLogsOpen(true)
                    setLogProjectId(projectId);
                    setLogProjectName(projectName);
                }}
                onViewLogs={(projectId, projectName) => {
                    setIsLogsOpen(true);
                    setLogProjectId(projectId);
                    setLogProjectName(projectName);
                }}
            />
        </>
    );
}
