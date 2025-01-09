import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";
import { capitalizeFirstChar } from "../../../utils/formatData";

// Props type for a component:
type Props = {
  Fundinfo: FundData;
};

type FundItem = {
  id: string;
  type: string;
  supporting_document: string;
};

type FundData = FundItem[];

function FundDetails({ Fundinfo }: Props) {
  if (!Fundinfo || Fundinfo.length == 0) return <NoDoc />;

  return (
    <>
      <div className="row">
        {Fundinfo.map((doc: FundItem) => (
          <div className="col-3">
            <CardData type={capitalizeFirstChar(doc.type)} folder="fundDocuments" filename={doc.supporting_document} />
          </div>
        ))}
      </div>
    </>
  );
}

export default FundDetails;
