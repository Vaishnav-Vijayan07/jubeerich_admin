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
import UserSelectionModal from "../forms/UserSelectionModal";
import VisaAssignTable from "./VisaAssignTable";

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

const VisaPendings = withSwal((props: any) => {
    const { swal } = props;
    const navigate = useNavigate();
    const [tableData, setTableData] = useState<any>([]);
    const [selected, setSelected] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { loading: dropDownLoading, dropdownData } = useDropdownData("visa_members");
    const [openUserModal, setOpenUserModal] = useState<boolean>(false);
    const [openAssignVisaModal, setOpenAssignVisaModal] = useState<boolean>(false);
    const [validatedData, setValidatedData] = useState<any>(null);
    const [visaMembers, setVisaMembers] = useState<boolean>(false);
    
    let roleId: any;
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    
    if (userInfo) {
      let { role } = JSON.parse(userInfo);
      roleId = role;
    }

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
                <div className="d-flex justify-content-start align-items-center gap-2">
                    <span
                        className="action-icon"
                        onClick={() => navigate(`/kyc_details/${row.original.studyPreferenceDetails?.studyPreference?.userPrimaryInfoId}/${row.original.id}`)}
                    >
                        <i className="fs-3 mdi mdi-eye-outline"></i>
                    </span>
                </div>
            ),
            minWidth: 80,
        },
    ];

    const handleSelectedValues = (selectedItems: any) => {
        setSelected(selectedItems);
    };

    const handleAssignVisaMember = async (selected: any, id: any) => {
        try {
            const confirmation = await swal.fire({
                title: "Confirm Action",
                text: `Do you want to assign this visa to this member?`,
                icon: "question",
                iconColor: "#8B8BF5",
                showCancelButton: true,
                confirmButtonText: `Yes, Assign`,
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
                let payload = {
                    application_ids: selected,
                    user_id: id
                }
                const { data } = await axios.post("/assign_visa_application", payload);
                if (data?.status) {
                    showSuccessAlert(data?.message);
                }
            }

        } catch (error) {
            showErrorAlert(error);
        } finally {
            fetchPendingVisa();
        }
    }

    const handleAutoAssignVisaMembers = async (selected: any) => {
        try {
            const confirmation = await swal.fire({
                title: "Confirm Action",
                text: `Do you want to auto assign this visa to this member?`,
                icon: "question",
                iconColor: "#8B8BF5",
                showCancelButton: true,
                confirmButtonText: `Yes, Assign`,
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
                let payload = {
                    application_ids: selected,
                }
                const { data } = await axios.post("/auto_assign_visa_application", payload);
                if (data?.status) {
                    showSuccessAlert(data?.message);
                }
            }
        } catch (error) {
            showErrorAlert(error);
        } finally {
            fetchPendingVisa();
        }

    }

    const fetchPendingVisa = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get('/visa_pendings');
            if (data?.status) {
                setTableData(data?.data)
            }
        } catch (error) {
            showErrorAlert(error)
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleValidateAutoAssignVisa = async (selectedUsers: any) => {
        try {
            let payload = {
                visa_ids: selected,
                visa_members_list: selectedUsers
            }

            const { data } = await axios.post("/auto_assign_visa_validation", payload);
            
            if(data?.status){
                showSuccessAlert(data?.message);
                setVisaMembers(data?.visaMembers);
                setValidatedData(data?.assignedData);
                toggleAssignVisaModal()
            }

        } catch (error) {
            showErrorAlert(error);
        }
    }

    const toggleAssignVisaModal = () => {
        setOpenAssignVisaModal(!openAssignVisaModal)
    }

    const refetchVisaApplications = () => {
        fetchPendingVisa();
    }

    useEffect(() => {
        fetchPendingVisa();
    }, [])

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Manage Visa", path: "", active: true },
                ]}
                title={"Manage Visa"}
            />
            <Card className="bg-white">
                <Card.Body>
                    { roleId == visa_manager_id &&
                        <div className="d-flex flex-wrap gap-2 justify-content-end">
                            <Dropdown className="btn-group">
                                <Dropdown.Toggle disabled={selected?.length > 0 ? false : true} variant="light" className="table-action-btn btn-sm btn-blue">
                                    <i className="mdi mdi-account-plus"></i> {"Assign Visa Member"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ maxHeight: "150px", overflow: "auto" }}>
                                    {dropdownData?.visa_members?.map((item: any) => (
                                        <Dropdown.Item key={item?.value} onClick={() => handleAssignVisaMember(selected, item?.value)}>
                                            {item.label}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button
                                disabled={selected?.length > 0 ? false : true}
                                variant="light"
                                className="table-action-btn btn-sm btn-blue"
                                onClick={() => setOpenUserModal(true)}
                            >
                                <i className="mdi mdi-account-plus"></i> {"Auto Assign Visa Member"}
                            </Button>
                        </div>
                    }

                    <Table
                        columns={columns}
                        data={tableData || []}
                        pageSize={10}
                        onSelect={handleSelectedValues}
                        sizePerPageList={sizePerPageList}
                        isSortable={true}
                        pagination={true}
                        isSearchable={true}
                        isSelectable={true}
                        tableClass="table-striped dt-responsive nowrap w-100"
                        initialLoading={isLoading}
                    />
                </Card.Body>
            </Card>

            {
                openAssignVisaModal && (
                    <VisaAssignTable isOpenModal={openAssignVisaModal} toggleModal={toggleAssignVisaModal} responseData={validatedData} options={visaMembers || []} refetchLead={refetchVisaApplications} heading={"Auto Assign Management"} />
                )
            }

            <UserSelectionModal open={openUserModal} onClose={() => setOpenUserModal(false)} selectedUsersList={handleValidateAutoAssignVisa} heading="Select Visa Members to auto assign" usersList={dropdownData.visa_members} />
        </>
    );
});

export default VisaPendings;