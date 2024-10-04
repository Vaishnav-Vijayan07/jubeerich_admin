import { DropDownActionTypes } from "./constants";

export interface DropDownActionType {
  type:
    | DropDownActionTypes.API_RESPONSE_SUCCESS
    | DropDownActionTypes.API_RESPONSE_ERROR
    | DropDownActionTypes.GET_DROP_DOWN;
  payload: {} | string;
}

type Item = {
  label: string;
  value: number | string; // Depending on whether `item.id` is a number or string
  lead_type?: number | string; // Adjust according to actual type of `lead_type_id`
  source_id?: number | string; // Adjust according to actual type of `source_id`
  branch_id?: number | string; // Adjust according to actual type of `branch_id`
};
// common success
export const dropDownApiResponseSuccess = (
  actionType: string,
  data: Item | {}
): DropDownActionType => ({
  type: DropDownActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const dropDownApiResponseError = (
  actionType: string,
  error: any
): DropDownActionType => ({
  type: DropDownActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getDropDown = (types: string): DropDownActionType => ({
  type: DropDownActionTypes.GET_DROP_DOWN,
  payload: {
    types,
  },
});
