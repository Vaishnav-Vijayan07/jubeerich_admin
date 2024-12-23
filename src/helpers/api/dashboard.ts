import { APICore } from "./apiCore";

const api = new APICore();

//
function getDashboard(
  filterType: string = "daily", // Default to "daily"
  year?: string,
  month?: string,
  fromDate?: string,
  toDate?: string
) {
  const params: { [key: string]: string | undefined } = {
    filterType,
  };

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
  return api.get(baseUrl, params );
}

export { getDashboard };
