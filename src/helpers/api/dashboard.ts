import { APICore } from "./apiCore";

const api = new APICore();

//
function getDashboard(
  filterType: string = "daily", // Default to "daily"
  year?: string,
  month?: string,
  fromDate?: string,
  toDate?: string,
  country_id?: string | number
) {
  const params: { [key: string]: string | undefined | number } = {
    filterType,
  };

  console.log("params", country_id);

  if (country_id) {
    params["country_id"] = country_id;
  }

  // Based on the filter type, we populate the params accordingly
  switch (filterType) {
    case "monthly":
      params["year"] = year;
      params["month"] = month;

      break;

    case "weekly":
      params["fromDate"] = fromDate;
      params["year"] = year;
      params["month"] = month;

      break;

    case "custom":
      params["fromDate"] = fromDate;
      params["toDate"] = toDate;
      break;

    default:
      // Default filter type (daily) does not require any additional params
      break;
  }

  console.log("params", params);

  const baseUrl = "/dashboard";
  return api.get(baseUrl, params);
}

function getApplicationManagerTableDataApi(status?: string) {
  const params: any = {};
  if (status) {
    params.status = status;
  }

  const baseUrl = "/application_manager_table_data";
  return api.get(baseUrl, params);
}

function getCountriesApi() {
  const baseUrl = "/countries_by_admin";
  return api.get(baseUrl, {});
}

export { getDashboard, getCountriesApi, getApplicationManagerTableDataApi };
