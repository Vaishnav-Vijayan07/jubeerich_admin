import { login, logout, signup, forgotPassword } from "./auth";
import { getCategory, addCategory, deleteCategory, updateCategory } from "./master/category";
import { addPrograms, deletePrograms, getPrograms, updatePrograms } from "./master/programs";
import { getSources, updateSources, addSources, deleteSources } from "./master/source";
import { getChannels, addChannels, updateChannels, deleteChannels } from "./master/channels";
import { addCampaigns, getCampaigns, updateCampaigns, deleteCampaigns } from "./master/campaigns";
import { addBranches, deleteBranches, getBranches, updateBranches } from "./master/branches";
import { addAccessRole, deleteAccessRoles, getAccessRoles, updateAccessRole } from "./users/accessRoles";
import { addAdminUsers, deleteAdminUsers, getAdminUsers, updateAdminUsers, getFranchiseCounsellors } from "./users/adminUsers";
import { getLeads, addLeads, updateLeads, deleteLeads, getLeadUser } from "./leads";
import { getAllChecklists, getChecklistById, addChecklist, updateChecklist, deleteChecklist } from "./checklist";
import { addSubStatus, deleteSubStatus, getAllSubStatus, updateSubStatus } from "./subStatus";
import { addUniversitysApi, deleteUniversitysApi, getUniversitysApi, updateUniversitysApi } from "./university";
import {
  addVisaChecklistApi,
  deleteVisaChecklistApi,
  getVisaChecklistApi,
  updateVisaChecklistApi,
  getVisaConfigApi,
} from "./visa_checklist";
import {
  addCampusApi,
  deleteCampusApi,
  getCampusApi,
  updateCampusApi,
  getCampusCourseApi,
  configureCampusCourseApi,
  courseConfigurationApi,
  deleteCourseConfigApi,
} from "./campus";
import { addStatus, deleteStatus, getStatus, updateStatus, getStatusConfig } from "./master/status";
import { addCourseTypeApi, deleteCourseTypeApi, getCourseTypeApi, updateCourseTypeApi } from "./courseType";
import { addHistory, getAllHistories, getHistoriesById, updateHistory, deleteHistory, getHistoriesByLeadId } from "./history";
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
  getStatus,
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
  getStatusConfig,
  getFranchiseCounsellors,
  addUniversitysApi,
  deleteUniversitysApi,
  getUniversitysApi,
  updateUniversitysApi,
  addCampusApi,
  deleteCampusApi,
  getCampusApi,
  updateCampusApi,
  getCampusCourseApi,
  configureCampusCourseApi,
  addCourseTypeApi,
  deleteCourseTypeApi,
  getCourseTypeApi,
  updateCourseTypeApi,
  courseConfigurationApi,
  deleteCourseConfigApi,
  addVisaChecklistApi,
  deleteVisaChecklistApi,
  getVisaChecklistApi,
  updateVisaChecklistApi,
  getVisaConfigApi,
};
