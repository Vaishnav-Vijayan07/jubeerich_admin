export const baseUrl = "https://crm.intersmarthosting.in/jubeerich/";
// export const baseUrl = "http://localhost:7700";


//change status_id values
export const follow_up_id = 9;
export const not_responding_id = 7;
export const future_leads_id = 10;
export const new_lead_id = "35";
export const proposal_shared_id = "40";
export const meeting_to_be_scheduled_id = "53";
export const meeting_scheduled_id = "37";
export const spam_id = "45";
export const lost_id = "44";

//session user
export const AUTH_SESSION_KEY = "jb_user";

export const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#a9b3e6e2' : state.isFocused ? '#8a99e2' : '#fff',
      color: state.isSelected ? '#fff' : state.isFocused ? '#fff' : '#333',
      padding: 10,
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: '#333', // Color of the selected option displayed in the select box
    }),
  };
