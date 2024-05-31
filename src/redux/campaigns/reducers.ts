// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { CampaignActionTypes } from "./constants";

const INIT_STATE = {
  campaigns: [],
  loading: false,
  error: {},
};

interface CampaignData {
  id: string;
  channel_id: string;
  campaign_name: string;
  campaign_description: string;
  from_date: string;
  to_date: string;
  updated_by: string;
}

export interface ChannelActionType {
  type:
    | CampaignActionTypes.API_RESPONSE_SUCCESS
    | CampaignActionTypes.API_RESPONSE_ERROR
    | CampaignActionTypes.GET_CAMPAIGNS
    | CampaignActionTypes.ADD_CAMPAIGNS
    | CampaignActionTypes.UPDATE_CAMPAIGNS
    | CampaignActionTypes.DELETE_CAMPAIGNS;
  payload: {
    actionType?: string;
    data?: CampaignData | {};
    error?: string;
  };
}

interface State {
  sources?: CampaignData | {};
  loading?: boolean;
  value?: boolean;
}

const Campaign = (
  state: State = INIT_STATE,
  action: ChannelActionType
): any => {
  switch (action.type) {
    case CampaignActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CampaignActionTypes.GET_CAMPAIGNS: {
          return {
            ...state,
            campaigns: action.payload.data,
            loading: false,
          };
        }
        case CampaignActionTypes.ADD_CAMPAIGNS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case CampaignActionTypes.UPDATE_CAMPAIGNS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case CampaignActionTypes.DELETE_CAMPAIGNS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case CampaignActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CampaignActionTypes.GET_CAMPAIGNS: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case CampaignActionTypes.ADD_CAMPAIGNS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case CampaignActionTypes.UPDATE_CAMPAIGNS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case CampaignActionTypes.DELETE_CAMPAIGNS: {
          showErrorAlert(action.payload.error);

          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case CampaignActionTypes.GET_CAMPAIGNS:
      return { ...state, loading: true };
    case CampaignActionTypes.ADD_CAMPAIGNS:
      return { ...state, loading: true };
    case CampaignActionTypes.UPDATE_CAMPAIGNS:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Campaign;
