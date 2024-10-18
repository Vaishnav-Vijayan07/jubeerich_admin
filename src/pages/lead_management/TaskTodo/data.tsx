export const initialFormState = {
    id: "",
    title: "",
    description: "",
    due_date: "",
    status: "",
    priority: ""
}

export interface IFormState {
    id: string,
    title: string,
    description: string,
    due_date: string,
    status: string,
    priority: string
}

export const status = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
]

export const priority = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
]