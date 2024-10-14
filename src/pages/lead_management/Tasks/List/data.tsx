import avatarImg2 from "../../../../assets/images/users/user-9.jpg";
import avatarImg3 from "../../../../assets/images/users/user-3.jpg";
import avatarImg4 from "../../../../assets/images/users/user-4.jpg";
import avatarImg5 from "../../../../assets/images/users/user-5.jpg";
import avatarImg6 from "../../../../assets/images/users/user-6.jpg";

interface ChecklistsItems {
  id: number;
  title: string;
  status: boolean;
}

interface AttachmentsItems {
  id: number;
  file_name: string;
  size: string;
  file_type: string;
  file_path: string;
}

interface CommentsItems {
  id: number;
  author: string;
  comment: string;
  created_at: string;
  author_avatar: string;
}

interface SubStatusTypes {
  sub_status_id: string;
  sub_status_name: string;
  sub_status_color: string;
}

interface SubActionItems {
  sub_status: string;
  items: Array<SubStatusTypes>;
}

interface NextActionItems {
  id: number;
  status_name: string;
  color: string;
  sub_status: Array<SubActionItems>;
}

export interface TaskTypes {
  id: number;
  lead_title: string;
  name: string;
  status: string;
  status_id: string;
  due_date: string;
  color: string;
  status_name: string;
  lead_id: string;
  flag_name: string;
  created_at: string;
}

export interface TaskItemTypes {
  id: number;
  title: string;
  name: string;
  studentId: number;
  assigned_to: string;
  assignee_avatar: string;
  due_date: string;
  completed: boolean;
  priority: string;
  stage: string;
  checklists: Array<ChecklistsItems>;
  description: string;
  attachments: Array<AttachmentsItems>;
  comments: Array<CommentsItems>;
  selected: boolean;
  status_name: string;
  color: string;
  lead_id: string;
  enquiry: string;
  status: string;
  flag_name: string;
  status_id: string;
  phone: string;
  channel_name: string;
  email: string;
  company_name: string;
  next_actions: Array<NextActionItems>;
  source_name: string;
  lead_title: string;
  branch: string;
  next_status_name: string;
  next_status_color: string;
  created_at: string;
  completed_at: Date;
  is_completed: boolean;
  getTaskList: () => void;
  getAttachedFiles: () => void;
  attachedFiles: Array<AttachmentsItems>;
  setTaskArray: React.Dispatch<React.SetStateAction<TaskItemTypes[]>>;
  TaskArray: Array<TaskItemTypes>;
  handleUpdateLeadTitle: (taskId: any, name: any, newLeadTitle: any) => void;
  handleUpdateStatus: (
    taskId: number,
    status_name: string,
    color: string,
    status: string
  ) => void;
  pickedDate: Date;
  student_name?: any;
}

export interface TaskObjects {
  id: string;
  enquiry: string;
  lead_title: string;
  title: string;
  name: string;
  assigned_to: string;
  completed: boolean;
  status: string;
  status_id: string;
  checklists: Array<ChecklistsItems>;
  due_date: string;
  color: string;
  status_name: string;
  lead_id: string;
  flag_name: string;
  next_actions: Array<NextActionItems>;
  email: string;
  phone: string;
  source_name: string;
  channel_name: string;
  company_name: string;
  branch: string;
  created_at: string;
  next_status: string | null;
  next_status_name: string;
  next_status_color: string;
  is_completed: boolean;
  completed_at: string;
}

const todayTasks = [
  {
    id: 1,
    title: "Draft the new contract document for sales team",
    assigned_to: "Arya Stark",
    assignee_avatar: avatarImg2,
    due_date: "Today 10am",
    completed: false,
    priority: "High",
    stage: "Todo",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: true },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
  {
    id: 2,
    title: "iOS App home page",
    assigned_to: "James B",
    assignee_avatar: avatarImg3,
    due_date: "Today 4pm",
    completed: false,
    stage: "In-progress",
    priority: "High",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
  {
    id: 3,
    title: "Write a release note",
    assigned_to: "Kevin C",
    assignee_avatar: avatarImg4,
    due_date: "Today 4pm",
    completed: false,
    stage: "In-progress",
    priority: "Medium",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
];

const upcomingTasks = [
  {
    id: 4,
    title: "Invite user to a project",
    assigned_to: "Arya Stark",
    assignee_avatar: avatarImg2,
    due_date: "Tomorrow 10am",
    stage: "Todo",
    completed: false,
    priority: "Low",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
  {
    id: 5,
    title: "Enable analytics tracking",
    assigned_to: "James B",
    assignee_avatar: avatarImg5,
    due_date: "27 Aug 10am",
    completed: false,
    stage: "Review",
    priority: "Low",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
  {
    id: 6,
    title: "Code HTML email template",
    assigned_to: "Kevin C",
    assignee_avatar: avatarImg6,
    due_date: "No Due Date",
    completed: false,
    stage: "Review",
    priority: "Medium",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
];

const otherTasks = [
  {
    id: 7,
    title: "Coordinate with business development",
    assigned_to: "Arya Stark",
    assignee_avatar: avatarImg2,
    due_date: "No Due Date",
    stage: "Todo",
    completed: false,
    priority: "High",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
  {
    id: 8,
    title: "Kanban board design",
    assigned_to: "James B",
    assignee_avatar: avatarImg5,
    stage: "Review",
    due_date: "30 Aug 10am",
    completed: false,
    priority: "Low",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
  {
    id: 9,
    title: "Draft the new contract document for sales team",
    assigned_to: "Kevin C",
    assignee_avatar: avatarImg6,
    due_date: "No Due Date",
    stage: "Done",
    completed: false,
    priority: "Medium",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
  {
    id: 10,
    title: "Draft the new contract document for vendor Abc",
    assigned_to: "Kevin C",
    assignee_avatar: avatarImg6,
    due_date: "2 Sep 10am",
    completed: false,
    stage: "Done",
    priority: "Medium",
    checklists: [
      { id: 1, title: "Find out the old contract documents", completed: false },
      {
        id: 2,
        title: "Organize meeting sales associates to understand need in detail",
        completed: false,
      },
      {
        id: 3,
        title: "Make sure to cover every small details",
        completed: false,
      },
    ],
    description:
      // tslint:disable-next-line: max-line-length
      "<p>This is a task description with markup support</p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>",
    attachments: [
      { id: 1, filename: "sales-assets.zip", size: "2.3 MB" },
      { id: 2, filename: "new-contarcts.docx", size: "1.3 MB" },
    ],
    comments: [
      {
        id: 1,
        author: "Arya Stark",
        text: "Should I review the last 3 years legal documents as well?",
        posted_on: "4:30am",
        author_avatar: avatarImg2,
      },
      {
        id: 2,
        author: "Gary Somya",
        text: "@Arya FYI..I have created some general guidelines last year.",
        posted_on: "3:30am",
        author_avatar: avatarImg3,
      },
    ],
  },
];

const intakeYearList = [
  { label: "2022", value: "2022" },
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "2030", value: "2030" },
  { label: "2031", value: "2031" },
];

const intakeMonthOptions = [
  { label: "January", value: "01" },
  { label: "April", value: "04" },
  { label: "July", value: "07" },
  { label: "September", value: "09" },
  { label: "November", value: "11" },
];

const courseOptions = [
  { label: "Computer Science", value: 1 },
  { label: "Mechanical Engineering", value: 2 },
  { label: "Business Administration", value: 3 },
  { label: "Fine Arts", value: 4 },
  { label: "Biotechnology", value: 5 },
];

const streamOptions = [
  { label: "Engineering", value: 1 },
  { label: "Business", value: 2 },
  { label: "Arts", value: 3 },
  { label: "Science", value: 4 },
  { label: "Medicine", value: 5 },
];

const courseTypeOptions = [
  { label: "Undergraduate", value: 1 },
  { label: "Postgraduate", value: 2 },
  { label: "Diploma", value: 3 },
  { label: "Doctorate", value: 4 },
  { label: "Certificate", value: 5 },
];

const campusOptions = [
  { label: "Main Campus", value: 1 },
  { label: "North Campus", value: 2 },
  { label: "South Campus", value: 3 },
  { label: "East Campus", value: 4 },
  { label: "West Campus", value: 5 },
];

const universityOptions = [
  { label: "Harvard University", value: 1 },
  { label: "Stanford University", value: 2 },
  { label: "University of Oxford", value: 3 },
  { label: "MIT", value: 4 },
  { label: "University of Cambridge", value: 5 },
];

const allTasks = [...todayTasks, ...upcomingTasks, ...otherTasks];

export const Visa_Types = [
  {
    label: "Tourist Visa", value: "tourist_visa"
  },
  {
    label: "Business Visa", value: "business_visa"
  },
  {
    label: "Work Visa", value: "work_visa"
  },
  {
    label: "Student Visa", value: "student_visa"
  },
  {
    label: "Transit Visa", value: "transit_visa"
  },
  {
    label: "Permanent Residency Visa", value: "permanent_residency_visa"
  },
]

export const visa_decline = 'visa_decline';
export const visa_approve = 'visa_approve';
export const travel_history = 'travel_history';

export {
  todayTasks,
  upcomingTasks,
  otherTasks,
  allTasks,
  intakeYearList,
  universityOptions,
  campusOptions,
  streamOptions,
  courseOptions,
  courseTypeOptions,
  intakeMonthOptions,
};
