import React from "react";

type Props = {
  title: string;
};

function CheckHeadings({ title }: Props) {
  return (
    <h4 className="py-1" style={{ width: "max-content", color: "#343A40", fontWeight: "700", fontSize: "16px" }}>
      {title}
    </h4>
  );
}

export default CheckHeadings;
