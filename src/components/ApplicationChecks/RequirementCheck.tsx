import { FileText, FileWarning } from "lucide-react";
import React from "react";

type EducationDetail = {
  qualification: string; // e.g., "Bachelor of Science"
  school_name: string; // e.g., "XYZ University"
  start_date?: string | null; // ISO format date string, nullable
  end_date?: string | null; // ISO format date string, nullable
  percentage?: string | number | null; // Percentage as a string, number, or nullable
};

type EducationDetailsArray = EducationDetail[];

type GapDetail = {
  start_date?: string | null; // ISO format date string, nullable
  end_date?: string | null; // ISO format date string, nullable
  reason: string; // Reason for the gap
  type: string; // Type of supporting documents, e.g., "certificate"
};

type GapDetailsArray = GapDetail[];

type Props = {
  data: EducationDetailsArray | GapDetailsArray;
  type : string
};
function RequirementCheck({ data,type }: Props) {

    console.log("DATAAAAA",data)

  if (!data) {
    return (
      <div>
        <div className="mb-1">
          <span style={{ fontWeight: 500, fontSize: "16px" }}>{type}</span>
        </div>
        <div
          style={{
            width: "280px",
            height: "53px",
            backgroundColor: "#F1556C33",
            borderRadius: "5px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FileWarning color="#F1556C" strokeWidth={0.5} />
          <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#333" }}>No Document Uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1">
        <span style={{ fontWeight: 500, fontSize: "16px" }}>{type}</span>
      </div>
      <div
        style={{
          width: "280px",
          height: "53px",
          backgroundColor: "#e0ddf8",
          borderRadius: "5px",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FileText color="#6657de" strokeWidth={0.5} />
        <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#333" }}>Document Uploaded</p>
      </div>
    </div>
  );
}

export default RequirementCheck;
