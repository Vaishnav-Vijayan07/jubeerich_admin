import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteLeads, getLead, getLeadUser } from "../../../../redux/actions";
import { Card, Button, Dropdown, Modal, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { sizePerPageList } from "./leadsData";
import Table from "../../../../components/Table";
import { APICore } from "../../../../helpers/api/apiCore";
import moment from "moment";

const LeadTable = ({ statusData, openModalWithClass, handleUpdate, leadsData, UsersData, setStandard, setSelectedLead }: any) => {
  const dispatch = useDispatch();

  const api = new APICore();
  const loggedInUser = api.getLoggedInUser();

  /* action column render */
  const StatusColumn = ({ row }: any) => {
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
        <Dropdown className="btn-group" align="end">
          <Dropdown.Toggle variant="light" className="table-action-btn btn-sm" style={{ backgroundColor: updatedColor, color: row.original.color }}>
            {row.original.status_name}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "150px", overflow: "auto" }}>
            {statusData?.map((item: any) => (
              <Dropdown.Item key={item.value} onClick={() => handleUpdateStatus(row.original.id, item)}>
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  };

  const UserColumn = ({ row }: any) => {
    return (
      <>
        <Dropdown className="btn-group" align="end">
          <Dropdown.Toggle variant="light" className="table-action-btn btn-sm">
            {row.original.assigned_user ? row.original.assigned_user : "Assign"}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "150px", overflow: "auto" }}>
            {UsersData?.map((item: any) => (
              <Dropdown.Item key={item.value} onClick={() => handleAssignUser(row.original.id, item)}>
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  };

  const AssignedUser = ({ row }: any) => {
    return <>{row.original.assigned_user}</>;
  };

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

          <div className="cursor-pointer" onClick={() => [openModalWithClass("modal-right"), handleUpdate(row.original)]}>
            <i className="mdi mdi-pencil text-muted font-18 vertical-middle"></i>
          </div>

          <div onClick={() => handleDelete(row.original.id)} className="cursor-pointer">
            <i className="mdi mdi-delete text-muted font-18 vertical-middle"></i>
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
      Header: "Lead Received Date",
      accessor: "lead_received_date",
      sort: true,
      Cell: ({ row }: any) => <div>{moment(row.original.lead_received_date).format("DD-MM-YYYY")}</div>,
    },
    {
      Header: "Assigned To",
      accessor: "assigned_user",
      Cell: loggedInUser.power_names?.includes("Add Leads", "Monitor") ? UserColumn : AssignedUser,
    },
    {
      Header: "status",
      accessor: "status",
      Cell: loggedInUser.power_names?.includes("Add Leads", "Monitor") ? StatusColumn : AssignedStatus,
      sort: false,
    },
    {
      Header: " ",
      accessor: "action",
      Cell: ActionColumn,
      sort: false,
    },
  ];

  const handleUpdateStatus = (id: string, item: any) => {
    axios
      .put(`/update_status/${id}`, {
        user_id: "1",
        status: item.value,
      })
      .then((res) => {
        dispatch(getLead());
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleAssignUser = (id: string, item: any) => {
    axios
      .put(`/assign_user/${id}`, {
        user_id: item.value,
      })
      .then((res) => {
        if (loggedInUser?.user_id == 1) {
          dispatch(getLead());
        } else {
          dispatch(getLeadUser());
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        dispatch(deleteLeads(id));
        // swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };
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
        theadClass="table-light"
        searchBoxClass="mt-2 mb-3"
      />
    </>
  );
};

export default LeadTable;
