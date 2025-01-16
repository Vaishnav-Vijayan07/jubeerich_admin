import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/checklist_master";

//
function getAllChecklists() {
    return api.get(`${baseUrl}`, {});
}

function getChecklistById(id:string) {
    return api.get(`${baseUrl}${id}`, {});
}

function addChecklist(params: {
    checklist_title: string,
    checklist_description: string,
    priority: number,
    checklist_type: string,
    has_attachment: boolean,
    status_id: string
}) {
    return api.create(`${baseUrl}`, params);
}

function updateChecklist(
    id: string,
    params: {
        checklist_title: string,
        checklist_description: string,
        priority: number,
        checklist_type: string,
        has_attachment: boolean,
        status_id: string
    }
) {

    return api.update(`${baseUrl}${id}`, params);
}

function deleteChecklist(id: string) {
    return api.delete(`${baseUrl}${id}`, {});
}

export { getAllChecklists, getChecklistById, addChecklist, updateChecklist, deleteChecklist };
