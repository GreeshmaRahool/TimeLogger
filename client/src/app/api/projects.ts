import axios from "axios";
import { TimeLog } from "../types/types";

const BASE_URL = "http://localhost:3001/api";

export async function getAll(sorted:boolean = false) {
    let url = `${BASE_URL}/projects`;

    if (sorted) {
        url += "?sortby=deadline&order=desc";
    }

    const response: any = await axios.get(url);

    console.log(response.data);
    return response.data;
}

export async function getTimeLogs(projectid: number) {
    let url = `${BASE_URL}/projects/${projectid}/timeregistrations`;
    const response: any = await axios.get(url);

    console.log(response.data);
    return response.data;
}

export async function logTime(projectid: number, log: TimeLog) {
    let url = `${BASE_URL}/projects/${projectid}/timeregistrations`;
    console.log(log);
    const response: any = await axios.post(url, log);
    console.log(response.data);
    return response.data;
}

export async function createNew(project: any) {
    const response: any = await axios.post(`${BASE_URL}/projects`, project);
    console.log(response.data);
    return response.data;
}
