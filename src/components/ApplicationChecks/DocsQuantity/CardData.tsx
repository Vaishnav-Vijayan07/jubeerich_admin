import { FileText } from "lucide-react";
import React from "react";
import { baseUrl } from "../../../constants";

type Props = {
  type: string;
  filename: string;
  folder: string
};

function CardData({ type, filename,folder }: Props) {
  const handleFileView = () => {
    window.open(`${baseUrl}/uploads/${folder}/${filename}`, "_blank");
  };

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
        onClick = {handleFileView}
      >
        <FileText color="#6657de" strokeWidth={0.5} />
        <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#333" }}>{type}</p>
      </div>
    </div>
  );
}

export default CardData;
