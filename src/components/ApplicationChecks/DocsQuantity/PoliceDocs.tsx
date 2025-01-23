import React from "react";
import CardData from "./CardData";
import NoDoc from "../NoDoc";

type Props = {
  PoliceDocs: PoliceDocs;
};

type DocItem = {
  id: number;
  certificate: string;
  country_name: string;
};

type PoliceDocs = DocItem[];

function PoliceDocs({ PoliceDocs }: Props) {
  if (!PoliceDocs?.length) return <NoDoc />;

  return (
    <div className="row">
      {PoliceDocs.map((doc: DocItem) => (
        <div className="col-3">
          <CardData type={doc.country_name} folder="policeClearenceDocuments" filename={doc.certificate} />
        </div>
      ))}
    </div>
  );
}

export default PoliceDocs;
