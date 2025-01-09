import React from "react";
import CardData from "./CardData";
import { getFileName } from "../../../utils/formatData";
import { FileWarning } from "lucide-react";
import NoDoc from "../NoDoc";

type Props = {
  userEmploymentHistories: {
    id: number;
    visa_page: string;
    permit_card: string;
    salary_account_statement: string;
    supporting_documents: string;
  };
};

function EmpHistories({ userEmploymentHistories }: Props) {
  if (!userEmploymentHistories) return <NoDoc />;

  return (
    <div className="row">
      <div className="col-3 mb-1">
        {!userEmploymentHistories?.visa_page ? (
          <NoDoc type="Visa Page" />
        ) : (
          <CardData folder="experienceHistoryDocs" type="Visa Page" filename={userEmploymentHistories?.visa_page} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!userEmploymentHistories?.permit_card ? (
          <NoDoc type="Permit Card" />
        ) : (
          <CardData folder="experienceHistoryDocs" type="Permit Card" filename={userEmploymentHistories?.permit_card} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!userEmploymentHistories?.salary_account_statement ? (
          <NoDoc type="Salary Account Statement" />
        ) : (
          <CardData folder="experienceHistoryDocs" type="Salary Account Statement" filename={userEmploymentHistories?.salary_account_statement} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!userEmploymentHistories?.supporting_documents ? (
          <NoDoc type="Supporting Documents" />
        ) : (
          <CardData folder="experienceHistoryDocs" type="Supporting Documents" filename={userEmploymentHistories?.supporting_documents} />
        )}
      </div>
    </div>
  );
}

export default EmpHistories;
