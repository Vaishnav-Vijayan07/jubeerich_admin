import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";

type WorkInfoItem = {
  id: number;
  designation: string;
  bank_statement: string;
  job_offer_document: string;
  experience_certificate: string;
  appointment_document: string;
  payslip_document: string;
};

type GroupedWorkInfo = {
  [company: string]: WorkInfoItem[];
};

// Props type for a component:
type Props = {
  WorkInfo: GroupedWorkInfo;
};

function WorkInfos({ WorkInfo }: Props) {
  console.log("WORKINFO", WorkInfo);

  if (!WorkInfo || Object.keys(WorkInfo).length === 0) return <NoDoc />;

  return (
    <>
      {Object.entries(WorkInfo).map(([company, docs]) => (
        <div key={company} className="mb-4">
          <h3>{company}</h3>
          <div className="row">
            {docs.map((doc) => (
              <div key={doc.id} className="row">
                <div className="col-3 mb-1">
                  <CardData type={`Designation: ${doc.designation}`} folder="workDocuments" filename={doc.bank_statement} />
                </div>

                <div className="col-3 mb-1">
                  <CardData type="Bank Statement" folder="workDocuments" filename={doc.bank_statement} />
                </div>

                <div className="col-3 mb-1">
                  <CardData type="Job Offer Document" folder="workDocuments" filename={doc.job_offer_document} />
                </div>

                <div className="col-3 mb-1">
                  <CardData type="Experience Certificate" folder="workDocuments" filename={doc.experience_certificate} />
                </div>

                <div className="col-3 mb-1">
                  <CardData type="Appointment Document" folder="workDocuments" filename={doc.appointment_document} />
                </div>

                <div className="col-3 mb-1">
                  <CardData type="Payslip Document" folder="workDocuments" filename={doc.payslip_document} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default WorkInfos;
