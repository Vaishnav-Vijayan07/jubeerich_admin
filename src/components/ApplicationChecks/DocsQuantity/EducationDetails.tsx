import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";

type Educationitem = {
  id: number;
  qualification: string;
  percentage: string;
  board_name: string;
  school_name: string;
  mark_sheet: string;
  admit_card: string;
  certificate: string;
};

type GroupedEducationInfo = {
  [company: string]: Educationitem[];
};

// Props type for a component:
type Props = {
  EducationInfo: Educationitem[];
};

function EducationDetails({ EducationInfo }: Props) {
  if (!EducationInfo || EducationInfo.length === 0) return <NoDoc />;

  return (
    <>
      {EducationInfo.map((docs: Educationitem) => (
        <div key={docs.id} className="mb-4">
          <h3>{`${docs?.school_name} - ${docs?.qualification} - ${docs?.board_name}`}</h3>
          <div className="row">
            <div className="row">
              <div className="col-3 mb-1">
                <CardData type="Mark Sheet" folder="educationDocuments" filename={docs?.mark_sheet} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Admit Card" folder="educationDocuments" filename={docs?.admit_card} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Certificate" folder="educationDocuments" filename={docs?.certificate} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default EducationDetails;
