import React from "react";
import { useDispatch } from "react-redux";
import Table from "../../components/Table";
import { APICore } from "../../helpers/api/apiCore";

const sizePerPageList = [
  {
    text: "10",
    value: 10,
  },
  {
    text: "25",
    value: 25,
  },
  {
    text: "50",
    value: 50,
  },
  {
    text: "100",
    value: 100,
  },
];

const LeadTable = ({ leadsData, setStandard, setSelectedLead }: any) => {

  //Status colum with styled bg
  const AssignedStatus = ({ row }: any) => {
    const rgbaComponents = row.original.color?.match(/\d+(\.\d+)?/g);
    var updatedColor;
    if (rgbaComponents && rgbaComponents.length === 4) {
      // Update the alpha (opacity) value to 0.2 (20% opacity)
      rgbaComponents[3] = "0.2";

      // Reconstruct the updated RGBA color value
      updatedColor = `rgba(${rgbaComponents.join(", ")})`;
    }
    return (
      <>
        <span
          className="px-2 py-1 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: updatedColor,
            color: row.original.color,
            flexWrap: "nowrap",
            fontSize: "12px",
          }}
        >
          {row.original.status_name}
        </span>
      </>
    );
  };

  /* action column render */
  const ActionColumn = ({ row }: any) => {
    return (
      <>
        <div className="cursor-pointer d-flex justify-content-center align-items-center gap-1">
          <div onClick={() => [setStandard(true), setSelectedLead(row.original)]}>
            <i className="mdi mdi-eye text-muted font-18 vertical-middle"></i>
          </div>
        </div>
      </>
    );
  };

  const PhoneColumn = ({ row }: any) => {
    return (
      <>
        <ul className="list-unstyled">
          <li>{row.original.phone}</li>
          <li>{row.original.alternate_phone}</li>
        </ul>
      </>
    );
  };

  // get all columns
  const columns = [
    {
      Header: "ID",
      accessor: "id",
      sort: true,
    },
    {
      Header: "Name",
      accessor: "name",
      sort: true,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: true,
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: PhoneColumn,
    },
    {
      Header: "Enquiry",
      accessor: "enquiry",
      sort: true,
    },
    {
      Header: "Company Name",
      accessor: "company_name",
      sort: true,
    },
    {
      Header: "Country",
      accessor: "country",
      sort: true,
    },
    {
      Header: "Assigned To",
      accessor: "assigned_user",
      sort: true,
    },
    {
      Header: "status",
      accessor: "status",
      Cell: AssignedStatus,
      sort: false,
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ActionColumn,
      sort: false,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={leadsData ? leadsData : []}
        pageSize={5}
        sizePerPageList={sizePerPageList}
        isSortable={true}
        pagination={true}
        isSearchable={true}
        theadClass="table-light mt-2"
        searchBoxClass="mt-2 mb-3"
      />
    </>
  );
};

export default LeadTable;
