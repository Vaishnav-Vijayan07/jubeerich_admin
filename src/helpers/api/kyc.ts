import { APICore } from "./apiCore";

const api = new APICore();

//
function getPendingKycsApi(type: string) {
  return api.get(`/kyc_pending`, { type });
}

function getRejectedKycsApi() {
  return api.get(`/kyc_rejected`, {});
}

function getApprovedKycsApi() {
  return api.get(`/kyc_approved`, {});
}

function assignToApplicationMemberApi(application_ids: any, user_id: any) {
  const dataToSend = {
    application_ids,
    user_id,
  };
  return api.updatePatch(`/assign_application`, dataToSend);
}

export { getPendingKycsApi, getRejectedKycsApi, getApprovedKycsApi, assignToApplicationMemberApi };
