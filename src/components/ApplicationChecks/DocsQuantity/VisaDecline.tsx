import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";
import { formatString } from "../../../utils/formatData";

// Props type for a component:
type Props = {
  VisaData: Visa;
};

type VisaDeclineItem = {
  id: string;
  visa_type: string;
  declined_letter: string;
};

type VisaApproveItem = {
  id: string;
  visa_type: string;
  approved_letter: string;
};

type Visa = VisaDeclineItem[] | VisaApproveItem[];

function isVisaDeclineItem(doc: VisaDeclineItem | VisaApproveItem): doc is VisaDeclineItem {
  return (doc as VisaDeclineItem).declined_letter !== undefined;
}

function VisaDeclineDetails({ VisaData }: Props) {
  if (!VisaData || VisaData.length === 0) return <NoDoc />;

  return (
    <>
      <div className="row">
        {VisaData.map((doc) => (
          <div className="col-3" key={doc.id}>
            <CardData
              type={formatString(doc.visa_type)}
              folder=""
              filename={isVisaDeclineItem(doc) ? doc.declined_letter : doc.approved_letter}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default VisaDeclineDetails;
