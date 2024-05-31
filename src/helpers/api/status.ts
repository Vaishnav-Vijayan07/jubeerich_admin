import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/status";

//
function getAllStatus() {
    return api.get(`${baseUrl}`, {});
}

function addStatus(params: {
    status_name: string,
    status_description: string,
    color: string,
    updated_by: string,
    status_type: number,
    is_substatus: number
}) {
    return api.create(`${baseUrl}`, params);
}

function updateStatus(
    id: string,
    params: {
        status_name: string,
        status_description: string,
        color: string,
        updated_by: string,
        status_type: number,
        is_substatus: number
    }
) {

    return api.update(`${baseUrl}/${id}`, params);
}

function deleteStatus(id: string) {
    return api.delete(`${baseUrl}/${id}`, {});
}

export { addStatus, deleteStatus, updateStatus, getAllStatus };
