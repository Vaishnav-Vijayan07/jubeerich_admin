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
  EducationInfo: GroupedEducationInfo;
};

function EducationDetails({ EducationInfo }: Props) {
  if (!EducationInfo || Object.keys(EducationInfo).length === 0) return <NoDoc />;

  return (
    <>
      {Object.entries(EducationInfo).map(([company, docs]) => (
        <div key={company} className="mb-4">
          <h3>{`${company} - ${docs[0]?.qualification} - ${docs[0]?.board_name}`}</h3>
          <div className="row">
            {docs.map((doc) => (
              <div key={doc.id} className="row">
                <div className="col-3 mb-1">
                  <CardData type="Mark Sheet" folder="educationDocuments" filename={doc.mark_sheet} />
                </div>

                <div className="col-3 mb-1">
                  <CardData type="Admit Card" folder="educationDocuments" filename={doc.admit_card} />
                </div>

                <div className="col-3 mb-1">
                  <CardData type="Certificate" folder="educationDocuments" filename={doc.certificate} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default EducationDetails;
