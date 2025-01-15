import React from "react";
import NoDoc from "../NoDoc";
import CardData from "./CardData";
import CheckHeadings from "../../CheckHeadings";
import moment from "moment";

type GapItem = {
  id: number;
  start_date: string;
  end_date: string;
  type: string;
  supporting_document: string;
};

type Props = {
  GapInfo: GapItem[];
  type: string;
};

function GapDocs({ GapInfo, type }: Props) {
  if (!GapInfo || GapInfo.length === 0) return <NoDoc />;

  return (
    <>
      <CheckHeadings title={type} />
      <div className="row">
        {GapInfo.map((docs: GapItem) => (
          <div key={docs.id} className="col-3 mb-1">
            <CardData
              type={`From ${moment(docs?.start_date).format("DD/MM/YYYY")} to ${moment(docs?.end_date).format("DD/MM/YYYY")}`}
              folder="gapDocuments"
              filename={docs?.supporting_document}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default GapDocs;
