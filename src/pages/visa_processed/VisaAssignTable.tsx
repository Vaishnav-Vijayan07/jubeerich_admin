import React, { useCallback, useEffect, useMemo, useState } from "react";
import { defaultTheme } from "../../AgGridSetup";
import { AgGridReact } from "ag-grid-react";
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Slide, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { GridApi, GridReadyEvent, IRowNode, RowNode } from "ag-grid-community";
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { withSwal } from "react-sweetalert2";
import moment from "moment";
import MaterialErrorAlert from "../../components/MaterialErrorAlert";
import SearchableSelectEditor from "../forms/SearchableSelectEditor";

const VisaAssignTable = withSwal(({ swal, isOpenModal, toggleModal, responseData, options, refetchLead, approvalType, heading }: any) => {
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [rowData, setRowData] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const pageSizes = [10, 20, 50, 100];
    const [columnDefs, setColumnDefs] = useState<any[]>([]);
    const [open, setOpen] = React.useState(false);
    const [modalBody, setModalBody] = useState<string>('');
    const [modelTitle, setModelTitle] = useState<string>('');

    const toggleAlertModal = () => {
        setOpen(!open);
    };

    const formattedData = useMemo(() => {
        return {
            teamMembers: options?.map((item: any) => ({ id: item.id.toString(), name: item.name.toString() })) || [],
        };
    }, [options]);

    useEffect(() => {
        setRowData(responseData);
    }, [responseData]);

    useEffect(() => {
        handleColumnDef();
    }, [options, formattedData]);

    const handleColumnDef = () => {
        setColumnDefs([
            {
              field: "application_id",
              headerName: "No.",
              sortable: true,
              filter: true,
              editable: false,
              maxWidth: 90,
              minWidth: 90,
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
              field: "campus_name",
              headerName: "Campus",
              sortable: true,
              filter: true,
              editable: false,
              cellClassRules: {
                "cell-error": (params: any) => !params.value,
              },
            },
            {
              field: "university_name",
              headerName: "University",
              sortable: true,
              filter: true,
              editable: false,
              cellClassRules: {
                "cell-error": (params: any) => !params.value,
              },
            },
            {
              field: "course_name",
              headerName: "Course",
              sortable: true,
              filter: true,
              editable: false,
              cellClassRules: {
                "cell-error": (params: any) => !params.value,
              },
            },
            {
              field: "counsellor",
              headerName: "Counsellor",
              sortable: true,
              filter: true,
              editable: false,
              cellClassRules: {
                "cell-error": (params: any) => !params.value,
              },
            },
            {
              field: "country",
              headerName: "Country",
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
              field: "assigned_to",
              headerName: "Assigned Visa Member",
              sortable: true,
              filter: true,
              editable: true,
              // cellEditor: "agSelectCellEditor",
              cellEditor: SearchableSelectEditor,
              cellEditorParams: {
                values: formattedData?.teamMembers?.map((cre: any) => cre.name),
                formatValue: (value: any) => {
                  const cre = formattedData?.teamMembers?.find((cre: any) => cre.id == value);
                  return cre ? cre.name : "";
                },
              },
              valueParser: (params: any) => {
                const selectedCre = formattedData?.teamMembers?.find((cre: any) => cre.name == params.newValue);
                return selectedCre ? selectedCre.id : null;
              },
              valueSetter: (params: any) => {
                const selectedCre = formattedData?.teamMembers?.find((cre: any) => cre.name === params.newValue);
                if (selectedCre) {
                  params.data[params.colDef.field] = selectedCre.id;
                  return true;
                }
                return false;
              },
              cellRenderer: (params: any) => {
                const selectedCre = formattedData?.teamMembers.find((cre: any) => cre.id == params.value);
                return selectedCre ? selectedCre.name : "";
              },
              cellClassRules: {
                "cell-error": (params: any) => !params.value,
              },
            },
          ]);
    };

    const onSelectionChanged = (params: any) => {
        const allRows: any = [];
        params.api.forEachNode((node: any) => allRows.push(node.data));

        const selectedNodes = params.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node: any) => node.data);
        setSelectedItems(selectedData);

        if (selectedData.length == allRows.length) {
            params.api.stopEditing();
        }
    };

    const handleApproved = async () => {
        if (!selectedItems || selectedItems.length == 0) {
            setModelTitle("Error");
            setModalBody("No leads selected. Please select leads to approve.")
            toggleAlertModal()
            return;
        }

        try {
            const result = await swal.fire({
                title: "Confirm Action",
                text: `Non selected lead will be discarded, Do you want to approve the selected leads? `,
                icon: "question",
                iconColor: "#8B8BF5",
                showCancelButton: true,
                confirmButtonText: `Yes, Approve`,
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

                let url = `/approve_auto_assign_visa`;

                const { data } = await axios.post(url, { visa_data: selectedItems });
                if (data) {
                    showSuccessAlert("Selected Visa Application Successfully Assigned");
                    toggleModal(false);
                    refetchLead();
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

    const handleDeleteRow = async (index: number, data: any) => {
        try {
            const result = await swal.fire({
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
                    container: "my-swal-index",
                },
                width: "26em",
                padding: "2em",
            });

            if (result.isConfirmed) {
                const updatedData = data.filter((_: any, i: any) => i != index);
                if (updatedData.length) {
                    setRowData(updatedData);
                }
            }
        } catch (error) {
            console.log("error", error);
            showErrorAlert("Error deleting item");
        }
    };

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
            refetchLead();
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
                        <button className="btn btn-success" onClick={handleApproved}>
                            Approve
                        </button>
                    </div>
                </div>
            </Dialog>

            <MaterialErrorAlert body={modalBody} title={modelTitle} toggleAlertModal={toggleAlertModal} open={open} />
        </>
    );
});

export default VisaAssignTable;
