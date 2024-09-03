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

type ItemType = WorkItem | AcademicItem;

export const isAllItemsPresent = (
  type: "work" | "academic",
  data: ItemType[]
): boolean => {
  return data.every((item: any) => {
    if (type === "work") {
      // Check fields other than id and years for work
      return (
        item["designation"] !== "" &&
        item["company"] !== "" &&
        item["from"] !== "" &&
        item["to"] !== ""
      );
    } else if (type === "academic") {
      // Check fields other than id and backlogs for academic
      return (
        item["qualification"] !== "" &&
        item["place"] !== "" &&
        item["percentage"] !== "" &&
        item["year_of_passing"] !== ""
      );
    }
    return false;
  });
};
