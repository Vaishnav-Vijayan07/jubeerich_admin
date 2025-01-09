import React from "react";

type Props = {
  value: string;
  title: string;
};

function PortalDetailInput({ value, title }: Props) {
  return (
    <>
      <div className="d-flex flex-column mb-2 mt-3">
        <span>{title}</span>
        <div className="portal-input-box d-flex flex-column align-items-center justify-content-center">
          <span>{value}</span>
        </div>
      </div>
    </>
  );
}

export default PortalDetailInput;

