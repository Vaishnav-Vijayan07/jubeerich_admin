import { APICore } from "./apiCore";

const api = new APICore();

//
function getPendingKycsApi() {
  return api.get(`/kyc_pending`, {});
}

function getRejectedKycsApi() {
  return api.get(`/kyc_rejected`, {});
}

function getApprovedKycsApi() {
  return api.get(`/kyc_approved`, {});
}

export { getPendingKycsApi, getRejectedKycsApi, getApprovedKycsApi };
