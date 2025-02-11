import * as yup from "yup";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Dropdown, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addLeads, deleteLeads, getLead, getLeadAssigned, getLeadAssignedByCounsellorTL, updateLeads } from "../../redux/actions";
import Select, { ActionMeta, OptionsType } from "react-select";
import {
  AUTH_SESSION_KEY,
  baseUrl,
  counsellor_tl_id,
  cre_id,
  cre_tl_id,
  it_team_id,
  region_id,
  showErrorAlert,
  showSuccessAlert,
} from "../../constants";
import FileUploader from "../../components/FileUploader";
import { Link, useLocation, useSearchParams } from "react-router-dom";
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
import { usePagination } from "../../hooks/usePagination";
import CustomPagination from "../../components/CustomPagination";
import CustomSearchBox from "../../components/CustomSearchBox";
import CustomLeadFilters from "../../components/CustomLeadFilters";
import { formatString } from "../../utils/formatData";

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
    currentLimit,
    currentPage,
    handlePageChange,
    handleLimitChange,
    totalPages,
    totalCount,
    handleSearch,
    isSearchApplied,
    onClose,
    value,
    onValueChange,
  } = props;

  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  let records: TableRecords[] = state;
  let userRole: any;
  let userBranchId: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
    userBranchId = JSON.parse(userInfo)?.branch_id;
  }

  const [tableData, setTableData] = useState([]);
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

  useEffect(() => {
    setTableData(state);
  }, [records]);

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

  useEffect(() => {
    applyFilter();
  }, [filters]);

  useEffect(() => {
    if (selectedOffice?.value == region_id) {
      setActiveRegion(true);
    } else {
      setActiveRegion(false);
      setSelectedRegion(null);
    }
  }, [selectedOffice]);

  const UserColumn = ({ row }: any) => {
    return (
      <>
        <Dropdown className="btn-group" style={{ maxHeight: "150px", overflow: "visible !important" }}>
          <Dropdown.Toggle variant="light" className="table-action-btn btn-sm">
            {row.original.cre_name}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "150px", overflow: "scroll" }}>
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

  const columns = useMemo(() => {
    return [
      {
        Header: "No",
        accessor: "id",
        sort: true,
        Cell: ({ row }: any) => {
          return <span>{currentPage * currentLimit - currentLimit + row.index + 1}</span>;
        },
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
        sort: true,
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
        sort: true,
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
      // {
      //   Header: "Followup Date",
      //   accessor: "followup_date",
      //   sort: false,
      //   minWidth: 100,
      //   Cell: ({ row }: any) => <span>{row.original.followup_date && moment(row.original.followup_date).format("DD/MM/YYYY")}</span>,
      // },
      {
        Header: "Department",
        accessor: "stage",
        sort: false,
        minWidth: 150,
      },
      // {
      //   Header: "Assigned CRE",
      //   accessor: "cre_name",
      //   // Cell: UserColumn,
      //   Cell: ({ row }: any) => (
      //     <span className="no-truncate-text">
      //       <UserColumn row={row} />
      //     </span>
      //   ),
      //   minWidth: 100,
      // },
      ...(user?.role == cre_tl_id
        ? [
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
          ]
        : []),
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
      ...(user?.role == counsellor_tl_id
        ? [
            {
              Header: "Assigned Status",
              accessor: "assigned_branch_counselor",
              sort: false,
              minWidth: 150,
              Cell: ({ row }: any) => <>{row?.original.assigned_branch_counselor ? <span>Assigned</span> : <span>{"Not Assigned"}</span>}</>,
            },
            {
              Header: "Assigned Counselor",
              accessor: "assigned_branch_counselor_name",
              sort: false,
              minWidth: 150,
            },
          ]
        : []),
      {
        Header: "Status",
        accessor: "lead_status",
        sort: false,
        isTruncate: true,
        Cell: ({ row }: any) => (
          <>
            <span>{formatString(row?.original?.lead_status)}</span>
          </>
        ),
      },
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
        Cell: ({ row }: any) => (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Link to={`/leads/manage/${row.original.id}`} className="action-icon">
              <i className="mdi mdi-eye-outline" style={{ color: "#758dc8" }}></i>
            </Link>
            {/* Edit Icon */}
            {/* <Link
              to="#"
              className="action-icon"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Edit"
              onClick={() => {
                handleUpdate(row.original);
                openModalWithClass("modal-full-width");
              }}
            >
              <i className="mdi mdi-square-edit-outline"></i>
            </Link> */}

            {/* Delete Icon */}
            {/* <Link
              to="#"
              className="action-icon"
              onClick={() => handleDelete(row.original.id)}
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Delete"
            >
              <i className="mdi mdi-delete-outline"></i>
            </Link> */}
          </div>
        ),
      },
    ];
  }, [currentPage, currentLimit, user, cres]);

  const handleSelectedValues = useCallback((values: any) => {
    setSelectedValues(values);
  }, []);

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
            dispatch(getLeadAssigned(currentPage, currentLimit, undefined, "created_at", "asc", undefined, undefined, undefined));
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
              dispatch(getLeadAssignedByCounsellorTL(currentPage, currentLimit));
            } else {
              dispatch(getLead(currentPage, currentLimit));
            }
            showSuccessAlert("Bulk assignment successful.");
          }
        } catch (error) {
          showErrorAlert(error);
        }
      }
    }
  };

  const toggleUploadModal = () => {
    setUploadModal(!uploadModal);
  };

  const toggle = () => {
    setModal(!modal);
  };

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

  const changeFilteredItemsData = useCallback((data: any) => {
    setTableData(data);
  }, []); // No dependencies

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

        <Col lg={12} className="p-0 form__card">
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
              <CustomSearchBox onSearch={handleSearch} />
              <Table
                columns={columns}
                data={tableData ? tableData : []}
                pageSize={totalCount}
                sizePerPageList={sizePerPageList}
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
                currentPage={currentPage}
                currentLimit={currentLimit}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
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
  const { loading: dropDownLoading, dropdownData } = useDropdownData("");
  const { currentLimit, currentPage, setCurrentPage, setCurrentLimit } = usePagination();
  const [searchParams, setSearchParams] = useSearchParams();

  const [counsellors, setCounsellors] = useState([]);

  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort_by") || "created_at");
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("sort_order") || "asc");

  const [selectedOffice, setSelectedOffice] = useState<any>("all");
  const [selectedCountry, setSelectedCountry] = useState<any>("all");
  const [selectedSource, setSelectedSource] = useState<any>("all");
  const [selectedCre, setSelectedCre] = useState<any>("all");

  const [close, setClose] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  const handlePageChange = useCallback((value: any) => {
    setCurrentPage(value);
  }, []);

  const handleLimitChange = useCallback((value: number) => {
    setCurrentLimit(value);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback(
    (value: any) => {
      setSearch(value);
      setCurrentPage(1);
      setCurrentLimit(20);
      if (userRole == cre_tl_id) {
        dispatch(
          getLeadAssigned(
            1,
            20,
            value,
            sortBy,
            sortOrder,
            selectedCountry == "all" ? undefined : selectedCountry,
            selectedOffice == "all" ? undefined : selectedOffice,
            selectedSource == "all" ? undefined : selectedSource
          )
        );
      } else {
        dispatch(getLeadAssignedByCounsellorTL(currentPage, currentLimit, search == "" ? undefined : search));
      }
    },
    [value]
  );

  const handleValue = useCallback((searchItem: string) => {
    setValue(searchItem);
  }, []);

  const handleClose = useCallback(() => {
    setClose(!close);
    setValue("");
    setSearch("");
  }, []);

  const resetSort = () => {
    if (userRole == cre_tl_id) {
      dispatch(
        getLeadAssigned(currentPage, currentLimit, search == "" ? undefined : search, sortBy, sortOrder, undefined, undefined, undefined, undefined)
      );
    } else {
      dispatch(getLeadAssignedByCounsellorTL(currentPage, currentLimit, search == "" ? undefined : search));
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    switch (name) {
      case "office":
        setSelectedOffice(value);
        break;
      case "country":
        setSelectedCountry(value);
        break;
      case "source":
        setSelectedSource(value);
        break;
      case "sort_by":
        setSortBy(value);
        break;
      case "sort_order":
        setSortOrder(value);
        break;
      case "cre":
        setSelectedCre(value);
        break;
      default:
        break;
    }
  };

  const resetFilters = () => {
    setSelectedOffice("all");
    setSelectedCountry("all");
    setSelectedSource("all");
    setSelectedCre("all");
    setSortBy("created_at");
    setSortOrder("asc");
    resetSort();
  };

  const applySort = () => {
    if (userRole == cre_tl_id) {
      dispatch(
        getLeadAssigned(
          currentPage,
          currentLimit,
          search == "" ? undefined : search,
          sortBy,
          sortOrder,
          selectedCountry == "all" ? undefined : selectedCountry,
          selectedOffice == "all" ? undefined : selectedOffice,
          selectedSource == "all" ? undefined : selectedSource,
          selectedCre == "all" ? undefined : selectedCre
        )
      );
    } else {
      dispatch(getLeadAssignedByCounsellorTL(currentPage, currentLimit, search == "" ? undefined : search));
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const { user, state, error, loading, initialLoading, users, franchisees, branchCounsellor, flag, limit, totalPages, totalCount, isSearchApplied } =
    useSelector((state: RootState) => ({
      user: state.Auth.user,
      state: state.Leads.assignedLeads,
      totalPages: state.Leads.totalPages,
      limit: state.Leads.limit,
      totalCount: state.Leads.totalCount,
      isSearchApplied: state.Leads.isSearchApplied,
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
    const params: any = {
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    setSearchParams(params);
  }, [sortBy, sortOrder, setSearchParams]);

  useEffect(() => {
    console.log("HERE");

    dispatch(getFlag());
    if (userRole == cre_tl_id) {
      dispatch(
        getLeadAssigned(
          currentPage,
          currentLimit,
          search == "" ? undefined : search,
          sortBy,
          sortOrder,
          selectedCountry == "all" ? undefined : selectedCountry,
          selectedOffice == "all" ? undefined : selectedOffice,
          selectedSource == "all" ? undefined : selectedSource,
          selectedCre == "all" ? undefined : selectedCre
        )
      );
    } else {
      dispatch(getLeadAssignedByCounsellorTL(currentPage, currentLimit, search == "" ? undefined : search));
    }
    // dispatch(getFranchise())
    fetchAllCounsellors();
  }, [userRole, currentPage, currentLimit, search]);

  const fetchAllCounsellors = () => {
    axios
      .get("/get_all_counsellors")
      .then((res) => {
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

  return (
    <React.Fragment>
      <PageTitle breadCrumbItems={[{ label: "Assigned Leads", path: "/leads/assigned/manage", active: true }]} title={"Assigned Leads"} />

      <Row>
        <Col>
          <CustomLeadFilters
            countries={dropdownData?.countries}
            source={dropdownData?.sources}
            cres={dropdownData?.cres}
            selectedCountry={selectedCountry}
            selectedSource={selectedSource}
            selectedCre={selectedCre}
            onFilterChange={handleFilterChange}
            selectedSortBy={sortBy}
            selectedSortOrder={sortOrder}
            onApplySort={applySort}
            onClear={resetFilters}
          />
        </Col>
      </Row>

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
            currentLimit={currentLimit}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            totalCount={totalCount}
            handleSearch={handleSearch}
            isSearchApplied={isSearchApplied}
            onClose={handleClose}
            value={value}
            onValueChange={handleValue}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default AssignedLeads;
