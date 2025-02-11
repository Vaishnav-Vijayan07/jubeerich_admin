import React, { useCallback, useEffect, useMemo, useState } from "react";
import { defaultTheme } from "../../AgGridSetup";
import { AgGridReact } from "ag-grid-react";
import { AppBar, Dialog, IconButton, Slide, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GridApi, GridReadyEvent } from "ag-grid-community";
import { showErrorAlert } from "../../constants";
import { withSwal } from "react-sweetalert2";
import moment from "moment";
import { approvalTypes, assignTypes } from "../forms/data";
import SearchableSelectEditor from "../forms/SearchableSelectEditor";

const LeadAssignTable = withSwal(({ swal, isOpenModal, toggleModal, responseData, options, refetchUsers, approvalType, heading, updateSelectedUser }: any) => {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [rowData, setRowData] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const pageSizes = [10, 20, 50, 100];
    const [columnDefs, setColumnDefs] = useState<any[]>([]);


    const formattedData = useMemo(() => {
        if (approvalType == approvalTypes.delete_cre) {
            return {
                userDataCres: [ { id: null, name: "Select", role_id: null },...options]?.map((item: any) => ({ id: item?.id?.toString(), name: item?.name?.toString(), role_id: item?.role_id?.toString() })) || [],
            };
        } else {
            return {
                userDataCres: [ { id: null, name: "Select", role_id: null },...options]?.map((item: any) => ({ id: item?.id?.toString(), name: item?.name?.toString(), role_id: item?.role_id?.toString() })) || [],
            }
        }
    }, [options]);

    useEffect(() => {
        if (responseData && approvalType == approvalTypes.import_lead) {
            setRowData(responseData?.data);
        } else {
            setRowData(responseData);
        }
    }, [responseData]);

    useEffect(() => {
        handleColumnDef();
    }, [options, formattedData]);

    const handleColumnDef = () => {
        if (approvalType == approvalTypes.delete_cre) {
            setColumnDefs([
                {
                    field: "id",
                    headerName: "No.",
                    sortable: true,
                    filter: true,
                    editable: false,
                    maxWidth: 80,
                    minWidth: 80,
                    valueGetter: (params: any) => params.node.rowIndex + 1,
                },
                {
                    field: "full_name",
                    headerName: "Name",
                    sortable: true,
                    filter: true,
                    editable: false,
                    minWidth: 150,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "email",
                    headerName: "Email",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "city",
                    headerName: "City",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "phone",
                    headerName: "phone",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "lead_received_date",
                    headerName: "Lead Received Date",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellRenderer: (params: any) => {
                        if (!params.value) return "";
                        return moment(params.value).format("DD-MM-YYYY");
                    },
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "assigned_cre",
                    headerName: "Assign To",
                    sortable: true,
                    filter: true,
                    editable: true,
                    // cellEditor: "agSelectCellEditor",
                    cellEditor: SearchableSelectEditor,
                    cellEditorParams: {
                        values: formattedData?.userDataCres?.map((user: any) => user.name), // Only showing names in dropdown
                        formatValue: (value: any) => {
                            const user = formattedData?.userDataCres?.find((user: any) => user.id == value);
                            return user ? user.name : "";
                        },
                    },
                    valueParser: (params: any) => {
                        const selectedUser = formattedData?.userDataCres?.find((user: any) => user.name == params.newValue);
                        return selectedUser ? { id: selectedUser.id, role_id: selectedUser.role_id } : null;
                    },
                    valueSetter: (params: any) => {
                        const selectedUser = formattedData?.userDataCres?.find((user: any) => user.name == params.newValue);
                        if (selectedUser) {
                            params.data[params.colDef.field] = {
                                id: selectedUser.id,
                                role_id: selectedUser.role_id, // Store role_id along with id
                            };
                            return true;
                        }
                        return false;
                    },
                    cellRenderer: (params: any) => {
                        if (params.value && typeof params.value === "object") {
                            const selectedUser = formattedData?.userDataCres.find((user: any) => user.id == params.value.id);
                            return selectedUser ? `${selectedUser.name}` : "";
                        }
                        return "";
                    },
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                }
            ]);
        } else {
            setColumnDefs([
                {
                    field: "id",
                    headerName: "No.",
                    sortable: true,
                    filter: true,
                    editable: false,
                    maxWidth: 80,
                    minWidth: 80,
                    valueGetter: (params: any) => params.node.rowIndex + 1,
                },
                {
                    field: "full_name",
                    headerName: "Name",
                    sortable: true,
                    filter: true,
                    editable: false,
                    minWidth: 150,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "email",
                    headerName: "Email",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "city",
                    headerName: "City",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "phone",
                    headerName: "phone",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "lead_received_date",
                    headerName: "Lead Received Date",
                    sortable: true,
                    filter: true,
                    editable: false,
                    cellRenderer: (params: any) => {
                        if (!params.value) return "";
                        return moment(params.value).format("DD-MM-YYYY");
                    },
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                },
                {
                    field: "assigned_cre",
                    headerName: "Assign To",
                    sortable: true,
                    filter: true,
                    editable: true,
                    // cellEditor: "agSelectCellEditor",
                    cellEditor: SearchableSelectEditor,
                    cellEditorParams: {
                        values: formattedData?.userDataCres?.map((user: any) => user.name), // Only showing names in dropdown
                        formatValue: (value: any) => {
                            const user = formattedData?.userDataCres?.find((user: any) => user.id == value);
                            return user ? user.name : "";
                        },
                    },
                    valueParser: (params: any) => {
                        const selectedUser = formattedData?.userDataCres?.find((user: any) => user.name == params.newValue);
                        return selectedUser ? { id: selectedUser.id, role_id: selectedUser.role_id } : null;
                    },
                    valueSetter: (params: any) => {
                        const selectedUser = formattedData?.userDataCres?.find((user: any) => user.name == params.newValue);
                        if (selectedUser) {
                            params.data[params.colDef.field] = {
                                id: selectedUser.id,
                                role_id: selectedUser.role_id, 
                            };
                            return true;
                        }
                        return false;
                    },
                    cellRenderer: (params: any) => {
                        if (params.value && typeof params.value === "object") {
                            const selectedUser = formattedData?.userDataCres.find((user: any) => user.id == params.value.id);
                            return selectedUser ? `${selectedUser.name}` : "";
                        }
                        return "";
                    },
                    cellClassRules: {
                        "cell-error": (params: any) => !params.value,
                    },
                }
            ]);
        }
    };

    const onSelectionChanged = (params: any) => {
        const selectedNodes = params.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node: any) => node.data);
        setSelectedItems(selectedData);
    };

    const handleAssign = async () => {
        if (!selectedItems || selectedItems.length == 0) {
            showErrorAlert("No leads selected. Please select leads to Assign.");
            return;
        }

        const hasInvalidItem = selectedItems.some((item) => {
            return !item.assigned_cre?.id;
        });

        if (hasInvalidItem) {
            showErrorAlert("Some selected leads are missing required fields: Assign To.");
            return;
        }

        let formattedItems = selectedItems.map((item: any) => ({
            id: Number(item?.id),
            assigned_user: Number(item?.assigned_cre?.id),
            role_id: Number(item?.assigned_cre?.role_id)
        }));

        try {
            const result = await swal.fire({
                title: "Confirm Action",
                text: `Non selected lead will be discarded, Do you want to approve the selected leads? `,
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
                    container: "my-swal-index",
                },
                width: "26em",
                padding: "2em",
            });

            if (result.isConfirmed) {
                if (approvalType == approvalTypes.delete_cre) {
                    updateSelectedUser(formattedItems, assignTypes.CRE);
                } else {
                    updateSelectedUser(formattedItems, assignTypes.Counsellor);
                }
            }
        } catch (error) {
            console.error(error);
            showErrorAlert("An error occurred while approving leads.");
        }
    };

    const onGridReady = useCallback((params: GridReadyEvent) => {
        setGridApi(params.api);
    }, []);

    const handleCellDoubleClick = () => {
        gridApi?.deselectAll();
    };

    const handleCloseModal = async () => {
        const result = await swal.fire({
            title: "Confirm Action",
            text: `You have pending leads to approve. Are you sure you want to leave?`,
            icon: "question",
            iconColor: "#8B8BF5",
            showCancelButton: true,
            confirmButtonText: `Yes, leave!`,
            cancelButtonText: "Cancel",
            confirmButtonColor: "#8B8BF5",
            cancelButtonColor: "#E97777",
            buttonsStyling: true,
            customClass: {
                popup: "rounded-4 shadow-lg",
                confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
                cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
                title: "fs-2 fw-normal mb-2",
                container: "my-swal-index",
            },
            width: "26em",
            padding: "2em",
        });

        if (result.isConfirmed) {
            toggleModal(false);
            refetchUsers();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey && event.key === "r") || (event.ctrlKey && event.shiftKey && event.key === "R")) {
                event.preventDefault();
                handleCloseModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <Dialog fullScreen open={isOpenModal} onClose={() => toggleModal(false)} TransitionComponent={Slide}>
                <AppBar sx={{ position: "relative", backgroundColor: "#38414A" }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <div className="ms-2">
                            <h3 className="text-white">{heading}</h3>
                        </div>
                    </Toolbar>
                </AppBar>
                <div className="d-flex flex-column" style={{ height: "100vh" }}>
                    <div className="ag-theme-alpine flex-grow-1" style={{ marginTop: "1rem", height: "auto", width: "100%" }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={{
                                resizable: true,
                                flex: 1,
                            }}
                            theme={defaultTheme}
                            animateRows={true}
                            onSelectionChanged={onSelectionChanged}
                            loadThemeGoogleFonts={true}
                            suppressAutoSize={true}
                            rowSelection={{
                                enableClickSelection: false,
                                mode: "multiRow",
                            }}
                            paginationPageSizeSelector={pageSizes}
                            onGridReady={onGridReady}
                            onCellDoubleClicked={handleCellDoubleClick}
                        />
                    </div>

                    <div className="d-flex justify-content-end p-2 gap-2">
                        <button className="btn btn-danger" onClick={handleCloseModal}>
                            Close
                        </button>
                        <button className="btn btn-success" onClick={handleAssign}>
                            Approve
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    );
});

export default LeadAssignTable;
