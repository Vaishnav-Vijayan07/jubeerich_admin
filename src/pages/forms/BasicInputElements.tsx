import * as yup from "yup";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Card, Button, Dropdown, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { deleteLeads, getLead, getLeadsTL } from "../../redux/actions";
import {
  AUTH_SESSION_KEY,
  showErrorAlert,
  showSuccessAlert,
  counsellor_tl_id,
  cre_tl_id,
  it_team_id,
  regional_manager_id,
  cre_id,
  cre_reception_id,
  showWarningAlert,
} from "../../constants";
import FileUploader from "../../components/FileUploader";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { approvalTypes, examtypes, initialState, initialValidationState, OptionType, sizePerPageList, TableRecords } from "./data";
import LeadsModal from "./LeadsModal";
import LeadsFilters from "./LeadsFilters";
import { AppDispatch } from "../../redux/store";
import { Pagination } from "@mui/material";
import CustomPagination from "../../components/CustomPagination";
import CustomSearchBox from "../../components/CustomSearchBox";
import LeadApprovalTable from "./LeadApprovalTable";
import SortBox from "../../components/SortBox";
import { formatString } from "../../utils/formatData";
import UserSelectionModal from "./UserSelectionModal";

const BasicInputElements = withSwal((props: any) => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  let userRole: any;
  let userBranchId: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
    userBranchId = JSON.parse(userInfo)?.branch_id;
  }

  const dispatch = useDispatch<AppDispatch>();
  const {
    swal,
    state,
    country,
    source,
    leadTypes,
    user,
    cres,
    status,
    office,
    channels,
    error,
    loading,
    counsellors,
    userData,
    region,
    flags,
    regionData,
    franchisees,
    branchForManager,
    branchCounsellors,
    initialLoading,
    handlePageChange,
    currentPage,
    totalPages,
    totalCount,
    currentLimit,
    handleLimitChange,
    handleSearch,
  } = props;

  const isDataPresent = state && state.length > 0;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]); // Filtered data
  const [handleUpdateData, setHandleUpdateData] = useState<any>({});
  const [clearLeadModal, setClearLeadModal] = useState<any>(null);
  const [clearError, setClearError] = useState<any>(null);
  const [clearFiles, setClearFiles] = useState<any>(false);
  const [openApproveModal, setOpenApproveModal] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [approvalOptionsData, setApprovalOptionsData] = useState<any>(null);
  const [assignedApprovalData, setAssignedApprovalData] = useState<any>(null);
  const [approvalType, setApprovalType] = useState<string>("");
  const [creList, setCreList] = useState<any>(null);
  const [openUserSelectionModal, setOpenUserSelectionModal] = useState<boolean>(false);

  const getSlugOptions = async () => {
    try {
      const { data } = await axios.get(`/get_slug_options`);
      setApprovalOptionsData(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSlugOptions();
  }, []);

  useEffect(() => {
    setFilteredItems(state);
  }, [state]);

  let records: TableRecords[] = filteredItems;

  useEffect(() => {
    records = filteredItems;
  }, [filteredItems]);

  const changeFilteredItemsData = useCallback((data: any) => {
    setFilteredItems(data);
  }, []);

  const handleClearModal = () => {
    setClearLeadModal((prev: any) => !prev);
    setHandleUpdateData({});
  };

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    full_name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be a 10-digit number")
      .required("Phone is required"),
    lead_type_id: yup.string().required("Lead type is required").nullable(),
    source_id: yup.string().required("Source is required").nullable(),
    channel_id: yup.string().required("Channel is required").nullable(),
    office_type: yup.string().required("Office type is required").nullable(),
    lead_received_date: yup.date().required("Date is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });
  
  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Confirm Action",
        text: `Do you want to delete this lead?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, delete it!`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          dispatch(deleteLeads(id, currentPage, currentLimit));
          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  const columns = useMemo(() => {
    return [
      {
        Header: "No",
        accessor: "",
        sort: false,
        Cell: ({ row }: any) => <span>{currentPage * currentLimit - currentLimit + row.index + 1}</span>,
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
        minWidth: 100,
        isTruncate: true,
      },
      {
        Header: "Phone",
        accessor: "phone",
        sort: true,
        minWidth: 110,
        isTruncate: true,
      },
      {
        Header: "City",
        accessor: "city",
        sort: true,
        minWidth: 75,
      },
      {
        Header: "Country",
        accessor: "preferredCountries",
        filter: "includes",
        sort: false,
        minWidth: 100,
        isTruncate: true,
        Cell: ({ row }: any) => (
          <ul style={{ listStyle: "none", margin: "0" }}>
            {row.original.preferredCountries.map((item: any) => (
              <li>{item?.country_name}</li>
            ))}
          </ul>
        ),
      },
      {
        Header: "Status",
        accessor: "lead_status",
        sort: false,
        isTruncate: true,
        Cell: ({ row }: any) => <><span>{formatString(row?.original?.lead_status)}</span></>,
      },
      {
        Header: "Office",
        accessor: "office_type_name",
        sort: true,
        minWidth: 75,
        isTruncate: true,
      },
      {
        Header: "Source",
        accessor: "source_name",
        sort: true,
        minWidth: 75,
      },
      {
        Header: "Lead Received Date",
        accessor: "lead_received_date",
        sort: false,
        minWidth: 150,
        Cell: ({ row }: any) => <span>{row.original.lead_received_date && moment(row.original.lead_received_date).format("DD/MM/YYYY")}</span>,
      },
      // {
      //   Header: "Followup Date",
      //   accessor: "followup_date",
      //   sort: false,
      //   minWidth: 150,
      //   Cell: ({ row }: any) => <span>{row.original.followup_date && moment(row.original.followup_date).format("DD/MM/YYYY")}</span>,
      // },
      {
        Header: "Department",
        accessor: "stage",
        sort: false,
        minWidth: 30,
        isTruncate: true,
      },
      ...(user?.role == cre_tl_id
        ? [
            {
              Header: "Assigned CRE",
              accessor: "cre_name",
              sort: false,
              minWidth: 50,
              isTruncate: true,
            },
          ]
        : []),
      ...(user?.role == counsellor_tl_id
        ? [
            {
              Header: "Assigned Status",
              accessor: "assigned_branch_counselor",
              sort: false,
              minWidth: 50,
              Cell: ({ row }: any) => <>{row?.original.assigned_branch_counselor ? <span>Assigned</span> : <span>{"Not Assigned"}</span>}</>,
              isTruncate: true,
            },
            {
              Header: "Assigned Counselor",
              accessor: "assigned_branch_counselor_name",
              sort: false,
              minWidth: 50,
              isTruncate: true,
            },
          ]
        : []),
      ...(user?.role == cre_id
        ? [
            {
              Header: "Assigned by",
              accessor: "updated_by_user",
              sort: false,
              minWidth: 50,
              isTruncate: true,
            },
          ]
        : []),
      ...(user?.role == regional_manager_id
        ? [
            {
              Header: "Branch Assigned",
              accessor: "assigned_regional_manager",
              sort: false,
              minWidth: 50,
              isTruncate: true,

              Cell: ({ row }: any) => <>{row?.original.assigned_counsellor_tl ? <span>Assigned</span> : <span>{"Not Assigned"}</span>}</>,
            },
          ]
        : []),
      ...(user?.role == regional_manager_id
        ? [
            {
              Header: "Branch Name",
              accessor: "branch_name",
              sort: false,
              minWidth: 50,
              isTruncate: true,
            },
          ]
        : []),
      ...(user?.role == cre_id || user?.role == cre_tl_id
        ? [
            {
              Header: "Assign Type",
              accessor: "assign_type",
              sort: false,
              minWidth: 50,
              isTruncate: true,

              Cell: ({ row }: any) => {
                const assignType = row.original.assign_type;

                // Define display text for each possible assignType
                const displayText: { [key: string]: string } = {
                  direct_assign: "Direct Assigned",
                  auto_assign: "Auto Assigned",
                  null: "", // Handle the string "null" explicitly
                  undefined: "", // Handle the string "undefined" explicitly
                };
                return <span>{displayText[assignType] || ""}</span>;
              },
            },
          ]
        : []),
      ...(user?.role == cre_id || user?.role == cre_reception_id
        ? [
            {
              Header: "Assigned counsellor",
              accessor: "counselors",
              sort: false,
              minWidth: 50,
              isTruncate: true,

              Cell: ({ row }: any) => {
                const counselors = row?.original.counselors;
                return (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {counselors && counselors.length > 0 ? (
                      counselors.map((item: any) => <li key={item?.counselor_name}>{item?.counselor_name}</li>)
                    ) : (
                      <li>Not assigned</li>
                    )}
                  </ul>
                );
              },
            },
          ]
        : []),
      // {
      //   Header: "Status",
      //   accessor: "status",
      //   sort: false,
      //   isTruncate: true,
      //   Cell: ({ row }: any) => (
      //     <ul style={{ listStyle: "none", margin: "0" }}>
      //       {row.original.preferredCountries.map((item: any) => (
      //         <li>{item?.status_name}</li>
      //       ))}
      //     </ul>
      //   ),
      // },
      {
        Header: "Actions",
        accessor: "",
        sort: false,
        Cell: ({ row }: any) => {
          const { isDeleteEnabled } = row.original;
          return (
            <div className="d-flex gap-2">
              {/* Edit Icon */}
              <Link to={`/leads/manage/${row.original.id}`} className="action-icon" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit">
                <i className="mdi mdi-eye-outline" style={{ color: "#758dc8" }}></i>
              </Link>

              {/* <Link
              to="#"
              className="action-icon"
              onClick={() => {
                handleUpdate(row.original);
                openModalWithClass("modal-full-width");
              }}
            >
              <i className="mdi mdi-square-edit-outline"></i>
            </Link> */}

              {/* Delete Icon */}
              {isDeleteEnabled && (
                <Link
                  to="#"
                  className="action-icon"
                  onClick={() => handleDelete(row.original.id)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Delete"
                >
                  {/* <i className="mdi mdi-delete"></i> */}
                  <i className="mdi mdi-delete-outline"></i>
                </Link>
              )}
            </div>
          );
        },
      },
    ];
  }, [user?.role, currentPage, currentLimit]);

  const handleSelectedValues = (values: any) => {
    setSelectedValues(values);
  };

  const handleDownloadClick = () => {
    const filePath = "/excel/sample.xlsx";
    const link = document.createElement("a");
    link.download = "sample.xlsx";
    link.href = process.env.REACT_APP_CLIENT_URL + filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadRjectedData = (file: any) => {
    const filePath = file;
    const apiUrl = process.env.REACT_APP_API_URL;

    // Ensure exactly one '/' between base URL and file path
    const url =
      apiUrl?.endsWith("/") && filePath.startsWith("/")
        ? `${apiUrl}${filePath.substring(1)}`
        : apiUrl?.endsWith("/") || filePath.startsWith("/")
        ? `${apiUrl}${filePath}`
        : `${apiUrl}/${filePath}`;

    const link = document.createElement("a");
    link.download = "rejected.xlsx";
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOnFileUpload = (files: any) => {
    setSelectedFile(files);
    // setProgress(0)
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
      const { data } = await axios.post(`/validate_excel_import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.status) {
        showSuccessAlert(data.message);
        setIsLoading(false);
        setSelectedFile([]);
        if (data?.invalidFileLink) downloadRjectedData(data.invalidFileLink);
        setClearFiles(!clearFiles);
        toggleUploadModal();
        setOpenApproveModal(true);
        setApprovalType(approvalTypes.import_lead);
        setResponseData(data);
      } else {
        showWarningAlert(data.message);
        setIsLoading(false);
        setSelectedFile([]);
        setClearFiles(!clearFiles);
        dispatch(getLead(currentPage, currentLimit));
        toggleApproveModal();
      }
    } catch (err) {
      showErrorAlert(err);
      setIsLoading(false);
      setSelectedFile([]);
      setClearFiles(!clearFiles);
    }
  };

  const handleAssignBulk = async (user_ids: any, cre_id: any) => {
    const result = await swal.fire({
      title: "Confirm Assignment",
      text: "Are you sure you want to assign this? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Assign",
    });

    if (result.isConfirmed) {
      if (user_ids.length > 0) {
        try {
          const { data } = await axios.post("/assign_cres", { user_ids, cre_id });

          if (data.status) {
            if (userRole == cre_tl_id) {
              dispatch(getLeadsTL(currentPage, currentLimit, undefined, "created_at", "asc", undefined, undefined, undefined));
            } else {
              dispatch(getLead(currentPage, currentLimit, undefined, "created_at", "asc", undefined, undefined, undefined));
            }
            showSuccessAlert("Assigned Successfully.");
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  const handleBranchCounsellorAssignBulk = async (user_ids: any, counsellor_id: any) => {
    const result = await swal.fire({
      title: "Confirm Assignment",
      text: "Are you sure you want to assign this? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Assign",
    });

    if (result.isConfirmed) {
      if (user_ids.length > 0) {
        try {
          const { data } = await axios.post("/assign_branch_counselor", {
            user_ids,
            counselor_id: counsellor_id,
          });

          if (data.status) {
            dispatch(getLead(currentPage, currentLimit));
            showSuccessAlert("Bulk assignment successful.");
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  const handleBranchAssignBulk = async (user_ids: any, branch_id: any) => {
    const result = await swal.fire({
      title: "Confirm Assignment",
      text: "Are you sure you want to assign this? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Assign",
    });

    if (result.isConfirmed) {
      if (user_ids.length > 0) {
        try {
          const { data } = await axios.post("/assign_counselor_tl", {
            user_ids,
            branch_id,
          });

          if (data.status) {
            if (userRole == cre_tl_id) {
              dispatch(getLeadsTL(currentPage, currentLimit));
            } else {
              dispatch(getLead(currentPage, currentLimit));
            }
            showSuccessAlert("Assigned Successfully.");
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  const handleAutoAssign = async (cresList: any) => {
    const result = await swal.fire({
      title: "Confirm Auto Assignment!",
      text: "The selected leads will be automatically assigned to the respective CREs.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Assign",
    });

    if (result.isConfirmed) {
      if (selectedValues.length > 0) {
        try {
          const { data } = await axios.post("/validate_auto_assign", {
            leads_ids: selectedValues,
            users_list: cresList,
          });
          if (data.status) {
            setCreList(data?.creList);
            setApprovalType(approvalTypes.assign_cre);
            setAssignedApprovalData(data?.assignedData);
            setOpenApproveModal(true);
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  const handleAutoAssignBranchCounsellors = async () => {
    const result = await swal.fire({
      title: "Confirm Auto Assignment!",
      text: "The selected leads will be automatically assigned to the respective CREs.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Assign",
    });

    if (result.isConfirmed) {
      if (selectedValues.length > 0) {
        try {
          const { data } = await axios.post("/branch_auto_assign", {
            leads_ids: selectedValues,
          });
          if (data.status) {
            dispatch(getLead(currentPage, currentLimit));
            showSuccessAlert("Bulk assignment successful.");
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      setValidationErrors(initialValidationState); // Clear validation errors
      setFormData(initialState); //clear form data
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
    setClearError((prev: any) => !prev);
    toggle();
  };

  const toggleApproveModal = () => {
    setOpenApproveModal((prev: any) => !prev);
  };

  const refetchLead = () => {
    if (approvalType == approvalTypes.import_lead) {
      dispatch(getLead(currentPage, currentLimit, undefined, "created_at", "asc", undefined, undefined, undefined));
    } else if (approvalType == approvalTypes.assign_cre) {
      if (userRole == cre_tl_id) {
        dispatch(getLeadsTL(currentPage, currentLimit, undefined, "created_at", "asc", undefined, undefined, undefined));
      } else {
        dispatch(getLead(currentPage, currentLimit, undefined, "created_at", "asc", undefined, undefined, undefined));
      }
    }
  };

  const selectedUsersList = (users: any) => {
    handleAutoAssign(users);
  }

  useEffect(() => {
    if (openApproveModal || openUserSelectionModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Clean up on component unmount
    };
  }, [openApproveModal, openUserSelectionModal]);

  return (
    <>
      <Row className="justify-content-between px-2">
        <LeadsModal
          clearLeadModal={clearLeadModal}
          clearError={clearError}
          country={country || []}
          source={source || []}
          leadTypes={leadTypes || []}
          user={user || []}
          office={office || []}
          channels={channels || []}
          error={error}
          loading={loading}
          regionData={regionData || []}
          franchisees={franchisees || []}
          region={region || []}
          flags={flags || []}
          modal={modal}
          setModal={setModal}
          toggle={toggle}
          handleUpdateData={handleUpdateData}
          initialLoading={initialLoading}
        />

        {user?.role == it_team_id && (
          <Modal show={uploadModal} onHide={toggleUploadModal} dialogClassName="modal-dialog-centered">
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              {/* <h1>Progress Bar = {progress}</h1> */}
              <p className="text-muted mb-1 font-small">*Please upload the Excel file following the example format.</p>
              <FileUploader
                onFileUpload={handleOnFileUpload}
                showPreview={true}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                clearFiles={clearFiles}
              />
              <div className="d-flex gap-2 justify-content-end mt-2">
                <Button className="btn-sm btn-blue waves-effect waves-light" onClick={handleDownloadClick}>
                  <i className="mdi mdi-download-circle"></i> Download Sample
                </Button>
                {selectedFile?.length == 1 && <Button className="btn-sm btn-success waves-effect waves-light" onClick={handleFileUpload} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Uploading...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-upload" /> Approve Lead
                    </>
                  )}
                </Button>}
              </div>
            </Modal.Body>
          </Modal>
        )}

        <Col lg={12} className="p-0 form__card">
          {/* {state && (
            <LeadsFilters
              changeFilteredItemsData={changeFilteredItemsData}
              state={state || []}
              status={status || []}
              source={source || []}
              country={country || []}
              userData={userData || []}
              counsellors={counsellors || []}
              cres={cres || []}
              branchForManager={branchForManager || []}
            />
          )} */}

          <Card className="bg-white py-3">
            <Card.Body>
              <div className="d-flex mb-4 flex-wrap gap-2 justify-content-between">
                <h4 className="header-title">Manage Leads</h4>
                <div className="d-flex flex-wrap gap-2 justify-content-end">
                  {user.role == it_team_id && (
                    <Button className="btn-sm btn-blue waves-effect waves-light" onClick={toggleUploadModal}>
                      <i className="mdi mdi-upload"></i> Import Leads
                    </Button>
                  )}

                  {user?.role == cre_tl_id && (
                    <>
                      <Dropdown className="btn-group">
                        <Dropdown.Toggle
                          disabled={selectedValues?.length > 0 ? false : true}
                          variant="light"
                          className="table-action-btn btn-sm btn-blue"
                        >
                          <i className="mdi mdi-account-plus"></i> Assign CRE's
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: "150px", overflow: "auto" }}>
                          {cres?.map((item: any) => (
                            <Dropdown.Item key={item.value} onClick={() => handleAssignBulk(selectedValues, item.value)}>
                              {item.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                      <Button
                        className="btn-sm btn-blue waves-effect waves-light float-end"
                        disabled={selectedValues?.length > 0 ? false : true}
                        // onClick={handleAutoAssign}
                        onClick={() => setOpenUserSelectionModal(true)}
                      >
                        <i className="mdi mdi-plus-circle"></i> Auto Assign
                      </Button>
                    </>
                  )}

                  {user?.role == counsellor_tl_id && (
                    <>
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

                      <Button
                        className="btn-sm btn-blue waves-effect waves-light float-end"
                        disabled={selectedValues?.length > 0 ? false : true}
                        onClick={handleAutoAssignBranchCounsellors}
                      >
                        <i className="mdi mdi-plus-circle"></i> Auto Assign Counsellors
                      </Button>
                    </>
                  )}

                  {user?.role == regional_manager_id && (
                    <>
                      <Dropdown className="btn-group">
                        <Dropdown.Toggle
                          disabled={selectedValues?.length > 0 ? false : true}
                          variant="light"
                          className="table-action-btn btn-sm btn-blue"
                        >
                          <i className="mdi mdi-account-plus"></i> Assign Branch
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: "150px", overflow: "auto" }}>
                          {branchForManager?.map((item: any) => (
                            <Dropdown.Item key={item.value} onClick={() => handleBranchAssignBulk(selectedValues, item.value)}>
                              {item.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}

                  <Button
                    className="btn-sm btn-blue waves-effect waves-light float-end"
                    onClick={() => [openModalWithClass("modal-full-width"), handleClearModal()]}
                    disabled={initialLoading}
                  >
                    <i className="mdi mdi-plus-circle"></i> Create Lead
                  </Button>
                </div>
              </div>
              {userRole == cre_tl_id || userRole == regional_manager_id || userRole == counsellor_tl_id ? (
                <>
                  <CustomSearchBox onSearch={handleSearch} />
                  <Table
                    columns={columns}
                    data={records ? records : []}
                    pageSize={totalCount}
                    // sizePerPageList={sizePerPageList}
                    isSortable={true}
                    pagination={true}
                    isCustomPaginationNeeded={true}
                    isSelectable={true}
                    isSearchable={false}
                    tableClass="table-striped dt-responsive nowrap w-100"
                    onSelect={handleSelectedValues}
                    initialLoading={initialLoading}
                  />
                  <CustomPagination
                    handleLimitChange={handleLimitChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    currentLimit={currentLimit}
                  />
                </>
              ) : (
                <>
                  <Row>
                    <CustomSearchBox onSearch={handleSearch} />
                  </Row>

                  <Table
                    columns={columns}
                    data={records ? records : []}
                    pageSize={totalCount}
                    sizePerPageList={sizePerPageList}
                    isSortable={true}
                    pagination={false}
                    isSearchable={false}
                    tableClass="table-striped dt-responsive nowrap w-100"
                    initialLoading={initialLoading}
                  />
                  {isDataPresent && (
                    <CustomPagination
                      handleLimitChange={handleLimitChange}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                      currentLimit={currentLimit}
                    />
                  )}
                </>
              )}

              {approvalType == approvalTypes.import_lead && openApproveModal && (
                <LeadApprovalTable
                  isOpenModal={openApproveModal}
                  toggleModal={setOpenApproveModal}
                  responseData={responseData}
                  options={approvalOptionsData}
                  refetchLead={refetchLead}
                  approvalType={approvalTypes.import_lead}
                  heading={'Lead Import Management'}
                />
              )}

              {approvalType == approvalTypes.assign_cre && openApproveModal && (
                <LeadApprovalTable
                  isOpenModal={openApproveModal}
                  toggleModal={setOpenApproveModal}
                  responseData={assignedApprovalData}
                  options={creList}
                  refetchLead={refetchLead}
                  approvalType={approvalTypes.assign_cre}
                  heading={'Auto Assign Management'}
                />
              )}

              {openUserSelectionModal && (
                <UserSelectionModal
                  onClose={() => setOpenUserSelectionModal(false)}
                  open={openUserSelectionModal}
                  heading={"Select CRE's to Auto Assign"}
                  usersList={cres}
                  selectedUsersList={selectedUsersList}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

export default BasicInputElements;
