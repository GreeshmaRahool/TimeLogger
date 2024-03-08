export interface Project {
    id: number;
    name: string;
    deadline: string;
};

export interface TimeLog {
    description: string;
    date: string;
    durationInMinutes: number;
};

export interface TimeLogResponse extends TimeLog {
    id: number;
};

export interface TimeLog {
    description: string;
    date: string;
    durationInMinutes: number;
};

export interface TimeLogResponse extends TimeLog {
    id: number;
};