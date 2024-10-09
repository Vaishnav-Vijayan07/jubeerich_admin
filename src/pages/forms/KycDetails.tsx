import React from "react";
import PageTitle from "../../components/PageTitle";

const KycDetails = () => {
  return (
    <div>
      <PageTitle
        breadCrumbItems={[
          { label: "KYC Details", path: "/kyc_details" },
          { label: "KYC Details", path: "/kyc_details/:id", active: true },
        ]}
        title={"Kyc Deatails"}
      />
    </div>
  );
};

export default KycDetails;
