type WorkItem = {
  id: string;
  years: number;
  designation: string;
  company: string;
  from: string;
  to: string;
};

type AcademicItem = {
  id: string;
  qualification: string;
  place: string;
  percentage: string;
  year_of_passing: string;
  backlogs: number;
};

type StudyPreferenceItem = {
  id: string;
  universityId: string;
  campusId: string;
  courseTypeId: string;
  streamId: string;
  courseId: string;
  intakeYear: string;
  intakeMonth: string;
  estimatedBudget: string;
};

type ExamItem = {
  id: string;
  exam_name: string;
  marks: string;
  exam_documents: null;
  document: null;
};

export const isAllItemsPresentWork = (data: WorkItem): boolean => {
  return (
    data.designation !== "" &&
    data.company !== "" &&
    data.from !== "" &&
    data.to !== ""
  );
};

export const isAllItemsPresentAcademic = (data: AcademicItem): boolean => {
  return (
    data.qualification !== "" &&
    data.place !== "" &&
    data.percentage !== "" &&
    data.year_of_passing !== ""
  );
};
export const isAllItemsPresentExam = (data: ExamItem): boolean => {
  return data.exam_name !== "" && data.marks !== "";
};

export const isAllItemsPresentStudyPreference = (
  data: StudyPreferenceItem
): boolean => {
  return (
    data.universityId !== "" &&
    data.campusId !== "" &&
    data.courseTypeId !== "" &&
    data.streamId !== "" &&
    data.courseId !== "" &&
    data.intakeYear !== "" &&
    data.intakeMonth !== "" &&
    data.estimatedBudget !== ""
  );
};
