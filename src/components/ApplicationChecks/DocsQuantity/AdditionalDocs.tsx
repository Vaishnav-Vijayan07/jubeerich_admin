import React from "react";
import CardData from "./CardData";
import NoDoc from "../NoDoc";

type Props = {
  AdditionalDocsData: {
    id: number;
    passport_doc: string;
    updated_cv: string;
    profile_assessment_doc: string;
    lor: string;
    sop: string;
    gte_form: string;
  };
};

function AdditionalDocs({ AdditionalDocsData }: Props) {
  return (
    <div className="row">
      <div className="col-3 mb-1">
        {!AdditionalDocsData?.passport_doc ? (
          <NoDoc type="Visa Type" />
        ) : (
          <CardData type="Visa Type" folder="studentAdditionalDocs" filename={AdditionalDocsData?.passport_doc} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!AdditionalDocsData?.updated_cv ? (
          <NoDoc type="Updated Cv" />
        ) : (
          <CardData type="Updated Cv" folder="studentAdditionalDocs" filename={AdditionalDocsData?.updated_cv} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!AdditionalDocsData?.profile_assessment_doc ? (
          <NoDoc type="Profile Assessment" />
        ) : (
          <CardData type="Profile Assessment" folder="studentAdditionalDocs" filename={AdditionalDocsData?.profile_assessment_doc} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!AdditionalDocsData?.lor ? (
          <NoDoc type="Letter of recommendation" />
        ) : (
          <CardData type="Letter of recommendation" folder="studentAdditionalDocs" filename={AdditionalDocsData?.lor} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!AdditionalDocsData?.sop ? (
          <NoDoc type="Statement of Purpose" />
        ) : (
          <CardData type="Statement of Purpose" folder="studentAdditionalDocs" filename={AdditionalDocsData?.sop} />
        )}
      </div>
      <div className="col-3 mb-1">
        {!AdditionalDocsData?.gte_form ? (
          <NoDoc type="Application/GTE Form" />
        ) : (
          <CardData type="Application/GTE Form" folder="studentAdditionalDocs" filename={AdditionalDocsData?.gte_form} />
        )}
      </div>
    </div>
  );
}

export default AdditionalDocs;
