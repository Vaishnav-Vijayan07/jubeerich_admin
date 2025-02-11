import * as yup from "yup";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Button, Dropdown, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
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
    baseUrl,
    cre_id,
    cre_reception_id,
    showWarningAlert,
    MIN_DATA_ON_TABLE,
} from "../../constants";
import FileUploader from "../../components/FileUploader";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { AppDispatch } from "../../redux/store";
import { Pagination } from "@mui/material";
import CustomPagination from "../../components/CustomPagination";
import CustomSearchBox from "../../components/CustomSearchBox";
import { formatString } from "../../utils/formatData";
import { approvalTypes } from "../forms/data";
import ExistLeadModal from "./ExistLeadModal";
import { initialState, initialValidationState, sizePerPageList, TableRecords } from "./data";

const ExistLeadsTable = withSwal((props: any) => {
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    let userRole: any;
    if (userInfo) {
        userRole = JSON.parse(userInfo)?.role;
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
        refetchLeads
    } = props;

    const isDataPresent = state && state.length > 0;

    //State for handling update function
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [uploadModal, setUploadModal] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [filteredItems, setFilteredItems] = useState<any[]>([]); // Filtered data
    const [handleUpdateData, setHandleUpdateData] = useState<any>({});
    const [clearLeadModal, setClearLeadModal] = useState<any>(null);
    const [clearError, setClearError] = useState<any>(null);
    
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
            {
                Header: "Department",
                accessor: "stage",
                sort: false,
                minWidth: 50,
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
            {
                Header: "Status",
                accessor: "lead_status",
                sort: false,
                isTruncate: true,
                Cell: ({ row }: any) => <><span>{formatString(row?.original?.lead_status)}</span></>,
            },
            {
                Header: "Actions",
                accessor: "",
                sort: false,
                Cell: ({ row }: any) => {
                    const { isDeleteEnabled } = row.original;
                    return (
                        <div className="d-flex gap-2">
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
                            {/* Eye Icon */}
                            <Link to={`/leads/manage/${row.original.id}`} className="action-icon" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit">
                                <i className="mdi mdi-eye-outline" style={{ color: "#758dc8" }}></i>
                            </Link>

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

    //handle delete function
    const handleDelete = async (id: string) => {
        const confirmation = await swal.fire({
            title: "Confirm Action",
            text: `Do you want to delete this lead?`,
            icon: "question",
            iconColor: "#8B8BF5",
            showCancelButton: true,
            confirmButtonText: `Yes, delete it!`,
            cancelButtonText: "Cancel",
            confirmButtonColor: "#8B8BF5",
            cancelButtonColor: "#E97777",
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

        if (confirmation.isConfirmed) {
            const { data } = await axios.delete(`delete_existing_lead/${id}`);

            if(data?.status){
                showSuccessAlert("Existing Lead Seleted Successfully");
                refetchExistLeads()
                if (isUpdate) {
                    setFormData(initialState);
                }
            }
        }
    };

    const handleUpdate = (item: any) => {
        if (item) {
            setHandleUpdateData({ ...item });
        }
    };

    const handleSelectedValues = (values: any) => {
        setSelectedValues(values);
    };

    useEffect(() => {
        if (!loading && !error) {
            setResponsiveModal(false);
            setValidationErrors(initialValidationState);
            setFormData(initialState);
        }
    }, [loading, error]);

    const toggle = () => {
        setModal(!modal);
    };

    const openModalWithClass = (className: string) => {
        setClearError((prev: any) => !prev);
        toggle();
    };

    const refetchExistLeads = async () => {
        refetchLeads()
    }
    return (
        <>
            <Row className="justify-content-between px-2">
                <ExistLeadModal
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
                    counsellors={counsellors}
                    refetchLeads={refetchExistLeads}
                />

                <Col lg={12} className="p-0 form__card">

                    <Card className="bg-white py-3">
                        <Card.Body>
                            <div className="d-flex mb-4 flex-wrap gap-2 justify-content-between">
                                <h4 className="header-title">Manage Exist Leads</h4>
                                <div className="d-flex flex-wrap gap-2 justify-content-end">

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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
});

export default ExistLeadsTable;
