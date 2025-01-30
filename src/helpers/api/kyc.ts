import { APICore } from "./apiCore";

const api = new APICore();

//
function getPendingKycsApi(type: string) {
  return api.get(`/kyc_pending`, { type });
}

function getApplicationByUserApi(status: string) {
  return api.get(`/kyc_pending_by_user`, { status: status });
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

function autoAssignToApplicationMemberApi(application_ids: any) {
  const dataToSend = {
    application_ids,
  };
  // return api.updatePatch(`/auto_assign_application`, dataToSend);
  return api.create(`/validate_auto_assign_application`, dataToSend);
}

export { getPendingKycsApi, getRejectedKycsApi, getApprovedKycsApi, assignToApplicationMemberApi, autoAssignToApplicationMemberApi ,getApplicationByUserApi};
