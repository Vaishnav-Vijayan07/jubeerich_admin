import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/campaigns";

function getCampaigns() {
  return api.get(`${baseUrl}`, {});
}

function addCampaigns(params: {
  channel_id: string;
  campaign_name: string;
  campaign_description: string;
  from_date: string;
  to_date: string;
  updated_by: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateCampaigns(
  id: string,
  params: {
    channel_id: string;
    campaign_name: string;
    campaign_description: string;
    from_date: string;
    to_date: string;
    updated_by: string;
  }
) {

  return api.update(`${baseUrl}/${id}`, params);
}

function deleteCampaigns(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getCampaigns, addCampaigns, updateCampaigns, deleteCampaigns };
