// constants
import { CampaignActionTypes } from "./constants";

export interface CampaignActionType {
  type:
    | CampaignActionTypes.API_RESPONSE_SUCCESS
    | CampaignActionTypes.API_RESPONSE_ERROR
    | CampaignActionTypes.GET_CAMPAIGNS
    | CampaignActionTypes.ADD_CAMPAIGNS
    | CampaignActionTypes.UPDATE_CAMPAIGNS
    | CampaignActionTypes.DELETE_CAMPAIGNS;
  payload: {} | string;
}

interface CampaignData {
  channel_id: string;
  campaign_name: string;
  campaign_description: string;
  from_date: string;
  to_date: string;
  updated_by: string;
}

// common success
export const CampaignApiResponseSuccess = (
  actionType: string,
  data: CampaignData | {}
): CampaignActionType => ({
  type: CampaignActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const CampaignApiResponseError = (
  actionType: string,
  error: string
): CampaignActionType => ({
  type: CampaignActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCampaign = (): CampaignActionType => ({
  type: CampaignActionTypes.GET_CAMPAIGNS,
  payload: {},
});

export const addCampaign = (
  channel_id: string,
  campaign_name: string,
  campaign_description: string,
  from_date: string | null,
  to_date: string | null,
  updated_by: string
): CampaignActionType => ({
  type: CampaignActionTypes.ADD_CAMPAIGNS,
  payload: {
    channel_id,
    campaign_name,
    campaign_description,
    from_date,
    to_date,
    updated_by,
  },
});

export const updateCampaign = (
  id: string,
  channel_id: string,
  campaign_name: string,
  campaign_description: string,
  from_date: string | null,
  to_date: string | null,
  updated_by: string
): CampaignActionType => ({
  type: CampaignActionTypes.UPDATE_CAMPAIGNS,
  payload: {
    id,
    channel_id,
    campaign_name,
    campaign_description,
    from_date,
    to_date,
    updated_by,
  },
});

export const deleteCampaign = (id: string): CampaignActionType => ({
  type: CampaignActionTypes.DELETE_CAMPAIGNS,
  payload: { id },
});
