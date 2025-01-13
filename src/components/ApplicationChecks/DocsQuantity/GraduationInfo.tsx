import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";

type Graduationitem = {
  id: number;
  qualification: string;
  percentage: string;
  university_name: string;
  college_name: string;
  mark_sheet: string;
  admit_card: string;
  certificate: string;
  backlog_certificate: string;
  registration_certificate: string;
  grading_scale_info: string;
  transcript: string;
  individual_marksheet: string;
};

// Props type for a component:
type Props = {
  GraduationInfo: Graduationitem[];
};

function GraduationDetails({ GraduationInfo }: Props) {
  if (!GraduationInfo || GraduationInfo.length === 0) return <NoDoc />;

  return (
    <>
      {GraduationInfo.map((graduation: Graduationitem) => (
        <div key={graduation.id} className="mb-4">
          <h3>{`${graduation?.qualification} - ${graduation?.college_name} - ${graduation?.university_name}`}</h3>
          <div className="row">
            <div  className="row">
              <div className="col-3 mb-1">
                <CardData type="Mark Sheet" folder="GraduationDocuments" filename={graduation.mark_sheet} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Admit Card" folder="GraduationDocuments" filename={graduation.admit_card} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Certificate" folder="GraduationDocuments" filename={graduation.certificate} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Backlog Certificate" folder="GraduationDocuments" filename={graduation.backlog_certificate} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Registration Certificate" folder="GraduationDocuments" filename={graduation.registration_certificate} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Grading Scale Info" folder="GraduationDocuments" filename={graduation.grading_scale_info} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Transcript" folder="GraduationDocuments" filename={graduation.transcript} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Individual Marksheet" folder="GraduationDocuments" filename={graduation.individual_marksheet} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default GraduationDetails;
