import * as yup from "yup";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Dropdown, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getSource } from "../../redux/sources/actions";
import { addLeads, deleteLeads, getLead, getLeadAssigned, getLeadAssignedByCounsellorTL, updateLeads } from "../../redux/actions";
import Select, { ActionMeta, OptionsType } from "react-select";
import {
  AUTH_SESSION_KEY,
  baseUrl,
  counsellor_tl_id,
  cre_id,
  cre_reception_id,
  cre_tl_id,
  customStyles,
  franchise_id_from_office,
  it_team_id,
  region_id,
  showErrorAlert,
  showSuccessAlert,
} from "../../constants";
import FileUploader from "../../components/FileUploader";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { city, examtypes } from "./data";
import moment from "moment";
import makeAnimated from "react-select/animated";
import useDropdownData from "../../hooks/useDropdownDatas";
import { getFranchise } from "../../redux/franchise/actions";
import LeadsModal from "./LeadsModal";
import LeadsFilters from "./LeadsFilters";
import { getFlag } from "../../redux/flag/actions";
import Swal from "sweetalert2";

interface OptionType {
  value: string;
  label: string;
}

interface TableRecords {
  id: string;
  source_id: string;
  channel_name: string;
  channel_description: string;
  updated_by: string;
  status: string;
}

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

const initialState = {
  id: "",
  full_name: "",
  email: "",
  phone: "",
  lead_type_id: null,
  source_id: null,
  channel_id: null,
  city: "",
  preferred_country: null,
  office_type: null,
  //   region_id: "",
  //   counsiler_id: "",
  //   branch_id: "",
  updated_by: null,
  remarks: "",
  lead_received_date: new Date().toISOString().split("T")[0],
  ielts: false,
  exam: "",
  zipcode: "",
  region_id: "",
  franchise_id: "",
};

const initialValidationState = {
  full_name: "",
  email: "",
  phone: "",
  lead_type_id: "",
  source_id: "",
  channel_id: "",
  city: "",
  preferred_country: "",
  office_type: "",
  //   region_id: "",
  //   counsiler_id: "",
  //   branch_id: "",
  updated_by: "",
  remarks: "",
  lead_received_date: "",
  ielts: "",
  zipcode: "",
  region_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    swal,
    state,
    country,
    source,
    leadTypes,
    user,
    cres,
    // regions,
    office,
    flags,
    channels,
    error,
    loading,
    status,
    userData,
    counsellors,
    region,
    franchisees,
    branchCounsellors,
    initialLoading,
  } = props;

  console.log("Region from state", region);
  console.log("cres ==>", cres);

  const [tableData, setTableData] = useState([]);

  //fetch token from session storage

  //Table data
  // const records: TableRecords[] = state;
  let records: TableRecords[] = state;

  useEffect(() => {
    setTableData(state);
  }, [records]);

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<OptionType[]>([]);

  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLeadType, setSelectedLeadType] = useState<any>(null);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [formData, setFormData] = useState(initialState);
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const fileInputRef = useRef<any>(null);
  const [activeRegion, setActiveRegion] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  const [className, setClassName] = useState<string>("");
  const [scroll, setScroll] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    source: "",
    city: "",
    CRE: "",
    counsiler_id: "",
    status_id: "",
    preferredCountries: "",
    updated_by: "",
    lead_received_date: "",
    followup_date: "",
  });
  const [handleUpdateData, setHandleUpdateData] = useState<any>({});

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const animatedComponents = makeAnimated();

  const validationSchema = yup.object().shape({
    full_name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email"),
    phone: yup.string().required("Phone is required"),
    lead_type_id: yup.string().required("Category is required"),
    source_id: yup.string().required("Source is required"),
    channel_id: yup.string().required("Channel is required"),
    city: yup.string().required("City is required"),
    preferred_country: yup.array().min(1, "At least one preferred country is required").required("Preferred country is required"),
    office_type: yup.string().required("Office type is required"),
    lead_received_date: yup.date().required("Date is required"),
    remarks: yup.string(),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  let userRole: any;
  let userBranchId: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
    userBranchId = JSON.parse(userInfo)?.branch_id;
  }
  const handleUpdate = (item: any) => {
    if (item) {
      setHandleUpdateData({ ...item });
    }
  };

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          dispatch(deleteLeads(id, true));
          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  const UserColumn = ({ row }: any) => {
    console.log("row", row);
    return (
      <>
        <Dropdown className="btn-group" style={{ maxHeight: "150px", overflow: "visible !important" }}>
          <Dropdown.Toggle variant="light" className="table-action-btn btn-sm">
            {row.original.cre_name}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "150px", overflow: "visible" }}>
            {cres.map((item: any) => (
              <Dropdown.Item key={item?.value} onClick={() => handleAssignBulk([row.original.id], item.value)}>
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  };

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: true,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Name",
      accessor: "full_name",
      sort: true,
      minWidth: 150,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: true,
      minWidth: 150,
    },
    {
      Header: "City",
      accessor: "city",
      sort: false,
      minWidth: 100,
    },
    {
      Header: "Country",
      accessor: "preferredCountries",
      sort: false,
      minWidth: 100,
      Cell: ({ row }: any) => (
        <ul style={{ listStyle: "none" }}>
          {row.original.preferredCountries.map((item: any) => (
            <li>{item?.country_name}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: "Office",
      accessor: "office_type_name",
      sort: false,
      minWidth: 100,
    },
    {
      Header: "Source",
      accessor: "source_name",
      sort: false,
      minWidth: 100,
    },
    {
      Header: "Lead Received Date",
      accessor: "lead_received_date",
      sort: false,
      minWidth: 150,
      Cell: ({ row }: any) => <span>{row.original.lead_received_date && moment(row.original.lead_received_date).format("DD/MM/YYYY")}</span>,
    },
    {
      Header: "Followup Date",
      accessor: "followup_date",
      sort: false,
      minWidth: 100,
      Cell: ({ row }: any) => <span>{row.original.followup_date && moment(row.original.followup_date).format("DD/MM/YYYY")}</span>,
    },
    {
      Header: "Department",
      accessor: "stage",
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Assigned CRE",
      accessor: "cre_name",
      // Cell: UserColumn,
      Cell: ({ row }: any) => (
        <span className="no-truncate-text">
          <UserColumn row={row} />
        </span>
      ),
      minWidth: 100,
    },
    ...(user?.role == cre_id || user?.role == cre_tl_id
      ? [
          {
            Header: "Assign Type",
            accessor: "assign_type",
            sort: false,
            Cell: ({ row }: any) => {
              const assignType = row.original.assign_type;

              // Define display text for each possible assignType
              const displayText: { [key: string]: string } = {
                direct_assign: "Direct Assigned",
                auto_assign: "Auto Assigned",
                null: "", // Handle the string "null" explicitly
                undefined: "", // Handle the string "undefined" explicitly
              };

              // Return the corresponding display text or "Unknown" if not found
              return <span>{displayText[assignType] || ""}</span>;
            },
          },
        ]
      : []),
    {
      Header: "Status",
      accessor: "status",
      sort: false,
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <Link to={`/leads/manage/${row.original.id}`} className="action-icon">
            <i className="mdi mdi-eye-outline" style={{ color: "#758dc8" }}></i>
          </Link>
          {/* Edit Icon */}
          <Link
            to="#"
            className="action-icon"
            onClick={() => {
              handleUpdate(row.original);
              openModalWithClass("modal-full-width");
            }}
          >
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link to="#" className="action-icon" onClick={() => handleDelete(row.original.id)}>
            {/* <i className="mdi mdi-delete"></i> */}
            <i className="mdi mdi-delete-outline"></i>
          </Link>
        </div>
      ),
    },
  ];

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedCountry([]);
    setSelectedLeadType(null);
    setSelectedChannel(null);
    setSelectedOffice(null);
    setSelectedSource(null);
    setSelectedRegion(null);
  };

  const handleSelectedValues = (values: any) => {
    setSelectedValues(values);
  };

  const handleAssignBulk = async (user_ids: any, cre_id: any) => {
    if (user_ids.length > 0) {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Assign",
      });

      if (result.isConfirmed) {
        try {
          const { data } = await axios.post("/assign_cres", { user_ids, cre_id });

          if (data.status) {
            dispatch(getLeadAssigned());
            showSuccessAlert("Bulk assignment successful.");
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  const handleBranchCounsellorAssignBulk = async (user_ids: any, counsellor_id: any) => {
    if (user_ids.length > 0) {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Assign",
      });

      if (result.isConfirmed) {
        try {
          const { data } = await axios.post("/assign_branch_counselor", { user_ids, counselor_id: counsellor_id });

          if (data.status) {
            if (userRole == counsellor_tl_id) {
              dispatch(getLeadAssignedByCounsellorTL());
            } else {
              dispatch(getLead());
            }
            showSuccessAlert("Bulk assignment successful.");
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  const handleDownloadClick = () => {
    const filePath = "/excel/jubeerich.xlsx";
    const link = document.createElement("a");
    link.download = "Student.xlsx";
    link.href = process.env.REACT_APP_CLIENT_URL + filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadRjectedData = (file: any) => {
    const filePath = file;
    const link = document.createElement("a");
    link.download = "rejected.xlsx";
    link.href = process.env.REACT_APP_API_URL + filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOnFileUpload = (files: any) => {
    setSelectedFile(files);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || selectedFile.length < 1 || !selectedFile[0]) {
      showErrorAlert("Please select a file.");
      return;
    }

    // Get the file extension
    const fileExtension = selectedFile[0].name.split(".").pop()?.toLowerCase();

    // Check if the file extension is '.xlsx'
    if (fileExtension !== "xlsx") {
      showErrorAlert("Please select a valid .xlsx file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile[0]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`/excel_import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(data);
      if (data.status) {
        showSuccessAlert(data.message);
        dispatch(getLead());
        setIsLoading(false);
        setSelectedFile([]);
        toggleUploadModal();
      } else {
        showErrorAlert(data.message);
        console.log("data.invalidFileLink", data.invalidFileLink);

        downloadRjectedData(data.invalidFileLink);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("error ==>", err);

      showErrorAlert(err);
      setSelectedFile([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      setValidationErrors(initialValidationState); // Clear validation errors
      setFormData(initialState); //clear form data
      setSelectedCountry([]);
      // Clear validation errors
    }
  }, [loading, error]);

  const toggleUploadModal = () => {
    setUploadModal(!uploadModal);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const openModalWithClass = (className: string) => {
    setClassName(className);
    setScroll(false);
    toggle();
  };

  useEffect(() => {
    applyFilter();
  }, [filters]);

  const applyFilter = () => {
    let filteredData: any = [...state];

    if (filters.source) {
      filteredData = filteredData.filter((data: any) => data.source_id == filters.source);
    }

    if (filters.city) {
      filteredData = filteredData.filter((data: any) => data.city == filters.city);
    }

    if (filters.CRE) {
      filteredData = filteredData.filter((data: any) => data.assigned_cre == filters.CRE);
    }

    if (filters.status_id) {
      filteredData = filteredData.filter((data: any) => data.status_id == filters.status_id);
    }

    if (filters.updated_by) {
      filteredData = filteredData.filter((data: any) => data.updated_by == filters.updated_by);
    }

    if (filters.counsiler_id) {
      filteredData = filteredData.filter((data: any) => data.counsiler_id == filters.counsiler_id);
    }

    if (filters.preferredCountries) {
      filteredData = filteredData.filter((data: any) =>
        data.preferredCountries.some((preferredCountry: any) => preferredCountry.id == filters.preferredCountries)
      );
    }

    if (filters.lead_received_date) {
      filteredData = filteredData.filter((data: any) => {
        const itemDate = new Date(data.lead_received_date).toDateString();
        const filterDate = new Date(filters.lead_received_date).toDateString();
        return itemDate === filterDate;
      });
    }

    if (filters.followup_date) {
      filteredData = filteredData.filter((data: any) => {
        const itemDate = new Date(data.followup_date).toDateString();
        const filterDate = new Date(filters.followup_date).toDateString();
        return itemDate === filterDate;
      });
    }

    setTableData(filteredData);
  };

  const changeFilteredItemsData = (data: any) => {
    setTableData(data);
  };

  useEffect(() => {
    if (selectedOffice?.value == region_id) {
      setActiveRegion(true);
    } else {
      setActiveRegion(false);
      setSelectedRegion(null);
    }
  }, [selectedOffice]);

  return (
    <>
      <Row className="justify-content-between px-2">
        <LeadsModal
          country={country || []}
          source={source || []}
          leadTypes={leadTypes || []}
          user={user || []}
          office={office || []}
          channels={channels || []}
          loading={loading}
          regionData={region || []}
          franchisees={franchisees || []}
          region={region || []}
          flags={flags || []}
          modal={modal}
          setModal={setModal}
          toggle={toggle}
          handleUpdateData={handleUpdateData}
          isAssignedLeads={true}
        />

        {user?.role == it_team_id && (
          <Modal show={uploadModal} onHide={toggleUploadModal} dialogClassName="modal-dialog-centered">
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <p className="text-muted mb-1 font-small">*Please upload the Excel file following the example format.</p>
              <FileUploader onFileUpload={handleOnFileUpload} showPreview={true} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
              <div className="d-flex gap-2 justify-content-end mt-2">
                <Button className="btn-sm btn-blue waves-effect waves-light" onClick={handleDownloadClick}>
                  <i className="mdi mdi-download-circle"></i> Download Sample
                </Button>
                <Button className="btn-sm btn-success waves-effect waves-light" onClick={handleFileUpload} disabled={isLoading}>
                  <i className="mdi mdi-upload"></i> Upload File
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        )}

        <Col lg={12} className="p-0 form__card">
          <LeadsFilters
            changeFilteredItemsData={changeFilteredItemsData}
            state={state}
            status={status}
            source={source}
            country={country}
            userData={userData}
            counsellors={counsellors}
            cres={cres}
            isAssignedLeads={true}
          />

          <Card className="bg-white">
            <Card.Body>
              <div className="d-flex flex-wrap gap-2 justify-content-end">
                {user.role == it_team_id && (
                  <Button className="btn-sm btn-blue waves-effect waves-light" onClick={toggleUploadModal}>
                    <i className="mdi mdi-upload"></i> Import Leads
                  </Button>
                )}

                {user?.role == cre_tl_id && (
                  <Dropdown className="btn-group">
                    <Dropdown.Toggle
                      disabled={selectedValues?.length > 0 ? false : true}
                      variant="light"
                      className="table-action-btn btn-sm btn-blue"
                    >
                      <i className="mdi mdi-account-plus"></i> Re-Assign CRE's
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: "150px", overflow: "auto" }}>
                      {cres?.map((item: any) => (
                        <Dropdown.Item key={item.value} onClick={() => handleAssignBulk(selectedValues, item.value)}>
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                {user?.role == counsellor_tl_id && (
                  <Dropdown className="btn-group">
                    <Dropdown.Toggle
                      disabled={selectedValues?.length > 0 ? false : true}
                      variant="light"
                      className="table-action-btn btn-sm btn-blue"
                    >
                      <i className="mdi mdi-account-plus"></i> Assign Counsellors
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: "150px", overflow: "auto" }}>
                      {branchCounsellors?.map((item: any) => (
                        <Dropdown.Item key={item.id} onClick={() => handleBranchCounsellorAssignBulk(selectedValues, item.id)}>
                          {item.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
              <h4 className="header-title mb-4">Manage Leads</h4>
              <div className="d-flex flex-wrap justify-content-end"></div>
              <Table
                columns={columns}
                data={tableData ? tableData : []}
                pageSize={10}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSelectable={true}
                isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
                onSelect={handleSelectedValues}
                initialLoading={initialLoading}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const AssignedLeads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const [counsellors, setCounsellors] = useState([]);

  const { loading: dropDownLoading, dropdownData } = useDropdownData("");

  const dispatch = useDispatch<AppDispatch>();
  const { user, state, error, loading, initialLoading, users, franchisees, branchCounsellor, flag } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    state: state.Leads.assignedLeads,
    error: state.Leads.error,
    loading: state.Leads.loading,
    initialLoading: state.Leads.initialloading,
    users: state.Users.adminUsers,
    franchisees: state.Franchise.franchiseUsers,
    branchCounsellor: state.Users?.branchCounsellor,
    flag: state?.Flag?.flags,
  }));

  let userRole: any;
  let userBranchId: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
    userBranchId = JSON.parse(userInfo)?.branch_id;
  }

  useEffect(() => {
    dispatch(getFlag());
    if (userRole == cre_tl_id) {
      dispatch(getLeadAssigned());
    } else {
      dispatch(getLeadAssignedByCounsellorTL());
    }
    // dispatch(getFranchise())
    fetchAllCounsellors();
  }, []);

  const fetchAllCounsellors = () => {
    axios
      .get("/get_all_counsellors")
      .then((res) => {
        console.log("Counsillers", res.data.data);
        setCounsellors(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const counsellorsData = useMemo(() => {
    if (!users) return [];
    return users?.map((item: any) => ({
      value: item.id.toString(),
      label: item.name,
    }));
  }, [users]);

  const franchiseeData = useMemo(() => {
    if (!franchisees) return [];
    return franchisees?.map((item: any) => ({
      value: item.id.toString(),
      label: item.name,
    }));
  }, [franchisees]);

  const flagsData = useMemo(() => {
    if (!flag) return [];
    return flag.map((data: any) => {
      return {
        value: data?.id,
        label: data?.flag_name,
      };
    });
  }, [flag]);

  // if (initialLoading) {
  //   return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  // }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/university" },
          { label: "Assigned Leads", path: "/master/university", active: true },
        ]}
        title={"Leads"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            country={dropdownData.countries || []}
            source={dropdownData.sources || []}
            leadTypes={dropdownData.leadTypes || []}
            user={user || null}
            cres={dropdownData.cres || []}
            status={dropdownData.statuses || []}
            counsellors={counsellorsData || []}
            channels={dropdownData.channels || []}
            office={dropdownData.officeTypes || []}
            error={error}
            loading={loading}
            userData={dropdownData.adminUsers || []}
            region={dropdownData.regions || []}
            franchisees={dropdownData.franchises || []}
            branchCounsellors={branchCounsellor || []}
            flags={flagsData || []}
            initialLoading={initialLoading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default AssignedLeads;
