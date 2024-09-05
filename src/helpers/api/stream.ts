import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/streams";

function getStreamApi() {
  return api.get(`${baseUrl}`, {});
}

function addStreamApi(params: {
  stream_name: string;
  stream_description: string;
  updated_by: string | null;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateStreamApi(
  id: string,
  params: {
    stream_name: string;
    stream_description: string;
    updated_by: string | null;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteStreamApi(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getStreamApi, addStreamApi, updateStreamApi, deleteStreamApi };
