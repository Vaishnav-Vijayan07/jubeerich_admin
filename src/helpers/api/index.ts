import { login, logout, signup, forgotPassword } from "./auth";
import { getCategory, addCategory, deleteCategory, updateCategory } from "./master/category";
import { addPrograms, deletePrograms, getPrograms, updatePrograms } from "./master/programs";
import { getSources, updateSources, addSources, deleteSources } from "./master/source";
import { getChannels, addChannels, updateChannels, deleteChannels } from "./master/channels";
import { addCampaigns, getCampaigns, updateCampaigns, deleteCampaigns } from "./master/campaigns";
import { addBranches, deleteBranches, getBranches, updateBranches } from "./master/branches";
import { addAccessRole, deleteAccessRoles, getAccessRoles, updateAccessRole } from "./users/accessRoles";
import { addAdminUsers, deleteAdminUsers, getAdminUsers, updateAdminUsers } from "./users/adminUsers";
import { getLeads, addLeads, updateLeads, deleteLeads, getLeadUser } from "./leads";
import { addStatus, deleteStatus, getAllStatus, updateStatus } from "./status";
import { getAllChecklists, getChecklistById, addChecklist, updateChecklist, deleteChecklist } from "./checklist";
import { addSubStatus, deleteSubStatus, getAllSubStatus, updateSubStatus } from "./subStatus";
import {
  addHistory,
  getAllHistories,
  getHistoriesById,
  updateHistory,
  deleteHistory,
  getHistoriesByLeadId,
} from "./history";
import { getDashboard } from "./dashboard";

export {
  login,
  logout,
  signup,
  forgotPassword,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getSources,
  updateSources,
  addSources,
  deleteSources,
  getChannels,
  addChannels,
  updateChannels,
  deleteChannels,
  addCampaigns,
  getCampaigns,
  updateCampaigns,
  deleteCampaigns,
  addBranches,
  deleteBranches,
  getBranches,
  updateBranches,
  getLeads,
  addLeads,
  updateLeads,
  deleteLeads,
  getLeadUser,
  addAccessRole,
  deleteAccessRoles,
  getAccessRoles,
  updateAccessRole,
  addAdminUsers,
  deleteAdminUsers,
  getAdminUsers,
  updateAdminUsers,
  addStatus,
  deleteStatus,
  getAllStatus,
  updateStatus,
  getAllChecklists,
  getChecklistById,
  addChecklist,
  updateChecklist,
  deleteChecklist,
  addSubStatus,
  deleteSubStatus,
  getAllSubStatus,
  updateSubStatus,
  addHistory,
  getAllHistories,
  getHistoriesById,
  updateHistory,
  deleteHistory,
  getHistoriesByLeadId,
  getDashboard,
  addPrograms,
  deletePrograms,
  getPrograms,
  updatePrograms,
};
