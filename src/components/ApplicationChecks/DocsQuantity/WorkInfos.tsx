import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";

type WorkInfoItem = {
  id: number;
  designation: string;
  company: string;
  bank_statement: string;
  job_offer_document: string;
  experience_certificate: string;
  appointment_document: string;
  payslip_document: string;
};

// Props type for a component:
type Props = {
  WorkInfo: WorkInfoItem[];
};

function WorkInfos({ WorkInfo }: Props) {
  console.log("WORKINFO", WorkInfo);

  if (!WorkInfo || WorkInfo.length === 0) return <NoDoc />;

  return (
    <>
      {WorkInfo.map((docs: WorkInfoItem) => (
        <div key={docs?.id} className="mb-4">
          <h3>{docs?.company}</h3>
          <div className="row">
            <div className="row">
              <div className="col-3 mb-1">
                <CardData type={`Designation: ${docs?.designation}`} folder="workDocuments" filename={docs?.bank_statement} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Bank Statement" folder="workDocuments" filename={docs?.bank_statement} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Job Offer Document" folder="workDocuments" filename={docs?.job_offer_document} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Experience Certificate" folder="workDocuments" filename={docs?.experience_certificate} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Appointment Document" folder="workDocuments" filename={docs?.appointment_document} />
              </div>

              <div className="col-3 mb-1">
                <CardData type="Payslip Document" folder="workDocuments" filename={docs?.payslip_document} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default WorkInfos;
