import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/lead_channel";

//
function getChannels() {
  return api.get(`${baseUrl}`, {});
}

function addChannels(params: { source_id: string; channel_name: string; channel_description: string; updated_by: string }) {
  return api.create(`${baseUrl}`, params);
}

function updateChannels(
  id: string,
  params: {
    source_id: string;
    channel_name: string;
    channel_description: string;
    updated_by: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteChannels(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getChannels, addChannels, updateChannels, deleteChannels };
