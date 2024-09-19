const REFRESH_DATA = "REFRESH_DATA";

export const refreshData = () => ({
  type: REFRESH_DATA,
});

// Initial state
const initialState = {
  refreshing: false,
};

// Reducer
const refreshReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case REFRESH_DATA:
      return {
        ...state,
        refreshing: !state.refreshing,
      };
    default:
      return state;
  }
};

export default refreshReducer;
