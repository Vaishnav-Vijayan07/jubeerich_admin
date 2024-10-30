import { APICore } from "./apiCore";

const api = new APICore();

const getAdminUsersAPI = () => {
  return api.get(`/admin_users`, {});
};

export { getAdminUsersAPI };
