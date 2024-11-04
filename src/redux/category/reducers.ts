// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { CategoryActionTypes } from "./constants";

const api = new APICore();

const INIT_STATE = {
  category: [],
  loading: false,
  initialloading: false,
  error: null,
  success: false,
  message: false,
  hasLoadedInitially: false,
};

interface CategoryData {
  id: number;
  name: string;
  description: string;
}

interface CategoryActionType {
  type:
    | CategoryActionTypes.API_RESPONSE_SUCCESS
    | CategoryActionTypes.API_RESPONSE_ERROR
    | CategoryActionTypes.ADD_CATEGORY
    | CategoryActionTypes.GET_CATEGORY
    | CategoryActionTypes.UPDATE_CATEGORY;
  // | CategoryActionTypes.DELETE_CATEGORY
  payload: {
    actionType?: string;
    data?: CategoryData | {};
    error?: string;
  };
}

interface State {
  category?: CategoryData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially: boolean;
}

const Category = (
  state: State = INIT_STATE,
  action: CategoryActionType
): any => {
  switch (action.type) {
    case CategoryActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CategoryActionTypes.GET_CATEGORY: {
          return {
            ...state,
            category: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case CategoryActionTypes.ADD_CATEGORY: {
          showSuccessAlert(action.payload.data);

          return {
            ...state,
            success: true,
            loading: false,
            initialloading: false,
            message: action.payload.data,
          };
        }
        case CategoryActionTypes.UPDATE_CATEGORY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            success: true,
            loading: false,
            initialloading: false,
            message: action.payload.data,
          };
        }
        case CategoryActionTypes.DELETE_CATEGORY: {
          showSuccessAlert(action.payload.data);

          return {
            ...state,
            success: true,
            loading: false,
            initialloading: false,
            message: action.payload.data,
          };
        }
        default:
          return { ...state };
      }

    case CategoryActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CategoryActionTypes.GET_CATEGORY: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case CategoryActionTypes.ADD_CATEGORY: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            success: false,
            loading: false,
            initialloading: false,
          };
        }
        case CategoryActionTypes.UPDATE_CATEGORY: {
          showErrorAlert(action.payload.error);

          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
            success: false,
          };
        }
        case CategoryActionTypes.DELETE_CATEGORY: {
          showErrorAlert(action.payload.error);

          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
            success: false,
          };
        }
        default:
          return { ...state };
      }

    case CategoryActionTypes.GET_CATEGORY:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case CategoryActionTypes.ADD_CATEGORY:
      return { ...state, loading: true };
    case CategoryActionTypes.UPDATE_CATEGORY:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Category;
