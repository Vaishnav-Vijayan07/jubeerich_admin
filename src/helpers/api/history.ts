import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/leads_history";

//
function getAllHistories() {
  return api.get(`${baseUrl}`, {});
}

function getHistoriesById(id: string) {
  return api.get(`${baseUrl}/${id}`, {});
}

function getHistoriesByLeadId(id: string) {
  return api.get(`leads_history_by_leadid/${id}`, {});
}

function addHistory(params: {
  lead_id: string;
  status_id: string;
  action_id: string;
  executive_id: string;
  date: string;
  status: string;
  change_to: string;
  checklist: string;
  comments: string;
  price: string;
  follow_up_date: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateHistory(
  id: string,
  params: {
    lead_id: string;
    status_id: string;
    action_id: string;
    executive_id: string;
    date: string;
    status: string;
    change_to: string;
    checklist: string;
    comments: string;
    price: string;
    follow_up_date: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteHistory(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getAllHistories, getHistoriesById, addHistory, updateHistory, deleteHistory, getHistoriesByLeadId };
