import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/sub_status";

//
function getAllSubStatus() {
    return api.get(`${baseUrl}`, {});
}

function addSubStatus(params: {
    status_id: string,
    next_status: string,
    updated_by: string,
}) {
    return api.create(`${baseUrl}`, params);
}

function updateSubStatus(
    id: string,
    params: {
        status_id: string,
        next_status: string,
        updated_by: string,
    }
) {

    return api.update(`${baseUrl}/${id}`, params);
}

function deleteSubStatus(id: string) {
    return api.delete(`${baseUrl}/${id}`, {});
}

export { addSubStatus, getAllSubStatus, updateSubStatus, deleteSubStatus };
