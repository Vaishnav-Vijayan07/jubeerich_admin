import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { AUTH_SESSION_KEY, customStyles, showErrorAlert, showSuccessAlert, visa_manager_id } from "../../constants";
import PageTitle from "../../components/PageTitle";
import { FormInput } from "../../components";
import Table from "../../components/Table";
import useDropdownData from "../../hooks/useDropdownDatas";
import { withSwal } from "react-sweetalert2";

const sizePerPageList = [
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

const VisaApprovals = withSwal((props: any) => {
    const { swal } = props;
    const navigate = useNavigate();
    const [tableData, setTableData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { loading: dropDownLoading, dropdownData } = useDropdownData("visa_members");

    const columns = [
        {
            Header: "No",
            accessor: "id",
            sort: true,
            Cell: ({ row }: any) => <span>{row.index + 1}</span>,
        },
        {
            Header: "Name",
            accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.full_name",
            sort: true,
            minWidth: 100,
        },
        {
            Header: "Country",
            accessor: "studyPreferenceDetails.studyPreference.country.country_name",
            sort: false,
            minWidth: 150,
        },
        {
            Header: "University",
            accessor: "studyPreferenceDetails.preferred_university.university_name",
            sort: false,
            minWidth: 150,
        },
        {
            Header: "Course",
            accessor: "studyPreferenceDetails.preferred_courses.course_name",
            sort: false,
            minWidth: 150,
        },
        {
            Header: "Lead Received Date",
            accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.lead_received_date",
            sort: false,
            Cell: ({ row }: any) => (
                <span>
                    {row.original.studyPreferenceDetails.studyPreference.userPrimaryInfo.lead_received_date &&
                        moment(row.original.studyPreferenceDetails.studyPreference.userPrimaryInfo.lead_received_date).format("DD/MM/YYYY")}
                </span>
            ),
            minWidth: 150,
        },
        {
            Header: "Application Status",
            accessor: "application_status",
            sort: false,
            minWidth: 150,
        },
        {
            Header: "Assigned Employee",
            accessor: "visa_application.name",
            sort: false,
            minWidth: 150,
            Cell: ({ value }: any) => <span>{value == null ? "Not Assigned" : value}</span>
        },
        {
            Header: "Actions",
            accessor: "",
            sort: false,
            Cell: ({ row }: any) => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <span
                        className="action-icon"
                        onClick={() => handleViewCheckList(row.original.studyPreferenceDetails.studyPreference.countryId, row.original.id) }
                    >
                        <i className="fs-3 mdi mdi-arrow-right-drop-circle-outline"></i>
                    </span>

                    <span
                        className="action-icon"
                        onClick={() => navigate(`/kyc_details/${row.original.studyPreferenceDetails?.studyPreference?.userPrimaryInfoId}/${row.original.id}`)}
                    >
                        <i className="fs-3 mdi mdi-eye-outline"></i>
                    </span>
                </div>
            ),
            minWidth: 150,
        },
    ];

    const fetchPendingVisa = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get('/visa_pendings_by_user');
            if (data?.status) {
                setTableData(data?.data)
            }
        } catch (error) {
            showErrorAlert(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleViewCheckList = async(id: any, app_id: any) => {
        navigate(`/visa/manage_checks/${id}/${app_id}`);
    }

    useEffect(() => {
        fetchPendingVisa();
    }, [])

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "My Visa Approvals", path: "", active: true },
                ]}
                title={"My Visa Approvals"}
            />
            <Card className="bg-white">
                <Card.Body>
                    <Table
                        columns={columns}
                        data={tableData || []}
                        pageSize={10}
                        sizePerPageList={sizePerPageList}
                        isSortable={true}
                        pagination={true}
                        isSearchable={true}
                        isSelectable={false}
                        tableClass="table-striped dt-responsive nowrap w-100"
                        initialLoading={isLoading}
                    />
                </Card.Body>
            </Card>
        </>
    );
});

export default VisaApprovals;