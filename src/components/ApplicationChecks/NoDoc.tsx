import { FileWarning } from "lucide-react";
import React from "react";

type Props = {
  type?: string;
};

function NoDoc({ type = "" }: Props) {
  return (
    <div>
      {type !== "" && (
        <div className="mb-1">
          <span style={{ fontWeight: 500, fontSize: "16px" }}>{type}</span>
        </div>
      )}
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

export default NoDoc;
