export const baseUrl = "https://crm.intersmarthosting.in/jubeerich/";
// export const baseUrl = "http://localhost:7700";

export const follow_up_id = 9;
export const not_responding_id = 7;
export const future_leads_id = 10;
export const new_lead_id = "35";
export const proposal_shared_id = "40";
export const meeting_to_be_scheduled_id = "53";
export const meeting_scheduled_id = "37";
export const spam_id = "45";
export const lost_id = "44";
export const region_id = "4";
export const franchise_id_from_office = "5";

// role ids
export const it_team_id = "2";
export const cre_id = "3";
export const cre_tl_id = "4";
export const cre_reception_id = "5";
export const counsellor_id = "7";
export const regional_manager_id = "10";
export const franchise_manager_id = "11";
export const franchise_counsellor_id = "12";
export const counsellor_tl_id = "13";
export const branch_counsellor_id = "14";
export const country_manager_id = "15";

//session user
export const AUTH_SESSION_KEY = "jb_user";

export const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#a9b3e6e2"
      : state.isFocused
      ? "#8a99e2"
      : "#fff",
    color: state.isSelected ? "#fff" : state.isFocused ? "#fff" : "#333",
    padding: 10,
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "#333",
  }),
};
