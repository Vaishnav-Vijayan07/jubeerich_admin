import React from "react";
import { Row } from "react-bootstrap";
import BasicDetails from "./BasicDetails";
import FormButtons from "./FormButtons";
import ProgramAvailabiltyCheck from "./ProgramAvailabiltyCheck";
import CampusCheck from "./CampusCheck";
import EntryRequirementCheck from "./EntryRequirementCheck";
import DocumentQualityCheck from "./DocumentQualityCheck";
import { useParams } from "react-router-dom";

const PendingDetailsById = () => {
  const { id } = useParams();

  // Memoize the item object so it isn't recreated on each render
  const item = React.useMemo(
    () => ({
      id: 1,
      full_name: "John Doe",
      country_name: "India",
      university_name: "University of Mumbai",
      course_name: "B.Tech",
      office_type_name: "Mumbai",
      source_name: "Walkin",
      lead_received_date: "2021-01-10 18:30:00",
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: "Assigned",
      assigned_to: "John Smith",
      employee_name: "John Doe",
      status: "In Progress",
    }),
    []
  );

  const [current, setCurrent] = React.useState(0);

  const buttonNavigations = (type: "next" | "prev") => {
    if (type === "next") {
      setCurrent(current + 1);
    } else {
      setCurrent(current - 1);
    }
  };

  return (
    <>
      <Row className="mt-2">
        <BasicDetails data={item} />
      </Row>

      {current === 0 && <ProgramAvailabiltyCheck />}
      {current === 1 && <CampusCheck />}
      {current === 2 && <EntryRequirementCheck />}
      {current === 3 && <DocumentQualityCheck />}

      <Row>
        <FormButtons handleNavigation={buttonNavigations} current={current} />
      </Row>
    </>
  );
};

export default PendingDetailsById;
