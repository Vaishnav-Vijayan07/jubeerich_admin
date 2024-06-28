import { CountryActionTypes } from "./constants";

interface CountryActionType {
  type:
    | CountryActionTypes.API_RESPONSE_SUCCESS
    | CountryActionTypes.API_RESPONSE_ERROR
    | CountryActionTypes.GET_COUNTRY
    | CountryActionTypes.GET_COUNTRY_BY_ID
    | CountryActionTypes.ADD_COUNTRY
    | CountryActionTypes.UPDATE_COUNTRY
    | CountryActionTypes.DELETE_COUNTRY;
  payload: {} | string;
}

export const countryApiResponseSuccess = (
  actionType: string,
  data: string
) => ({
  type: CountryActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const countryApiResponseError = (actionType: string, error: string) => ({
  type: CountryActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCountry = () => ({
  type: CountryActionTypes.GET_COUNTRY,
  payload: {},
});

export const getCountryById = (id: string) => ({
  type: CountryActionTypes.GET_COUNTRY_BY_ID,
  payload: { id },
});

export const addCountry = (country_name: string) => ({
  type: CountryActionTypes.ADD_COUNTRY,
  payload: {
    country_name,
  },
});

export const updateCountry = (id: string, country_name: string) => ({
  type: CountryActionTypes.UPDATE_COUNTRY,
  payload: {
    id,
    country_name,
  },
});

export const deleteCountry = (id: string) => ({
  type: CountryActionTypes.DELETE_COUNTRY,
  payload: { id },
});
