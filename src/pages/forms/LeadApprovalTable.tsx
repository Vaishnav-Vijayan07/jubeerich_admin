import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultTheme } from '../../AgGridSetup';
import { AgGridReact } from 'ag-grid-react';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Slide, Toolbar } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import RefreshConfirmation from '../../components/RefreshConfirmation';
import axios from 'axios';
import { GridApi, GridReadyEvent, IRowNode, RowNode } from 'ag-grid-community';
import { showErrorAlert, showSuccessAlert } from '../../constants';
import { withSwal } from "react-sweetalert2";

interface IRowData {
  id: number;
  source: string;
  channel: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  officeType: string;
  region: string;
  country: string;
  ielts: boolean;
  error: string | null;
}

const LeadApprovalTable = withSwal(({ swal, isOpenModal, toggleModal, responseData, options }: any) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const pageSizes = [10, 20, 50, 100];
  const [columnDefs, setColumnDefs] = useState<any[]>([]);

  const formattedData = useMemo(() => {
    return {
      sources: options?.sources?.map((item: any) => item.slug) || [],
      officeTypes: options?.officeTypes?.map((item: any) => item.slug) || [],
      regions: options?.regions?.map((item: any) => item.slug) || [],
      channels: options?.channels?.map((item: any) => item.slug) || [],
      franchises: options?.franchises?.map((item: any) => item.slug) || [],
      countries: options?.countries?.map((item: any) => item.country_code) || [],
    };
  }, [options]);

  useEffect(() => {
    if (responseData) setRowData(responseData?.data);
  }, [responseData]);

  useEffect(() => {
    handleColumnDef();
  }, [options, formattedData])

  const handleColumnDef = () => {
    setColumnDefs([
      {
        field: 'id',
        headerName: 'No.',
        sortable: true,
        filter: true,
        editable: false,
        width: 10,
        valueGetter: (params: any) => params.node.rowIndex + 1,
      },
      {
        field: 'source',
        headerName: 'Source',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: formattedData.sources,
        },
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'channel',
        headerName: 'Channel',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: formattedData.channels,
        },
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'full_name',
        headerName: 'Name',
        sortable: true,
        filter: true, editable: true,
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'email',
        headerName: 'Email',
        sortable: true,
        filter: true,
        editable: true,
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'phone',
        headerName: 'Phone',
        sortable: true,
        filter: true,
        editable: true,
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'city',
        headerName: 'City',
        sortable: true,
        filter: true,
        editable: true,
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'office_type',
        headerName: 'Office Type',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: formattedData.officeTypes,
        },
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'region_or_franchise',
        headerName: 'Region/Franchise',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [...formattedData.regions, ...formattedData.franchises],
        },
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'preferred_country_code',
        headerName: 'Country',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: formattedData.countries,
        },
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'lead_received_date', 
        headerName: 'Date', 
        sortable: true, 
        filter: true, 
        editable: true, 
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      {
        field: 'ielts',
        headerName: 'IELTS',
        sortable: true,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Yes', 'No']
        },
        cellClassRules: {
          'cell-error': (params: any) => !params.value,
        },
      },
      { field: 'error', headerName: 'Error', sortable: true, filter: true, editable: true },
      {
        field: 'delete',
        headerName: 'Actions',
        cellRenderer: (params: any) => {
          return (
            <span>
              <i onClick={() => {
                const index = params.node.rowIndex;
                const allRowsData = params.api.getRenderedNodes().map((node: any) => node.data);
                handleDeleteRow(index, allRowsData);
              }}
                className='mdi mdi-delete-outline fs-4'></i>
            </span>
          );
        },
        sortable: false,
        filter: false,
        editable: false
      }
    ])
  }

  const onSelectionChanged = (params: any) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    setSelectedItems(selectedData);
  };

  const handleApproved = async () => {
    if (!selectedItems || selectedItems.length == 0) {
      showErrorAlert('No leads selected. Please select leads to approve.');
      return;
    }
  
    const hasInvalidItem = selectedItems.some((item) => {
      return (
        !item.source || 
        !item.channel || 
        !item.office_type || 
        !item.email || 
        !item.phone ||
        !item.full_name ||
        item.errors
      );
    });
  
    if (hasInvalidItem) {
      showErrorAlert(
        'Some selected leads are missing required fields: Source, Channels, OfficeType, Email, or Phone.'
      );
      return;
    }
  
    try {
      const { data } = await axios.post('/approve_leads', { lead_data: selectedItems });
      console.log('Response', data);
      if (data) {
        showSuccessAlert('Selected Leads Successfully Approved');
        // toggleModal(false);
      }
    } catch (error) {
      console.error(error);
      showErrorAlert('An error occurred while approving leads.');
    }
  };

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const getCurrentTableData = () => {
    if (!gridApi) return [];

    const currentData: any[] = [];
    const renderedNodes = gridApi.getRenderedNodes();
    renderedNodes.forEach((node) => {
      currentData.push(node.data);
    });

    return currentData;
  };

  const handleDeleteRow = async(index: number, data: any) => {
    // const result = await swal.fire({
    //   title: "Confirm Action",
    //   text: `Do you want to save the changes?`,
    //   icon: "question",
    //   iconColor: "#8B8BF5", // Purple color for the icon
    //   showCancelButton: true,
    //   confirmButtonText: `Yes, Save`,
    //   cancelButtonText: "Cancel",
    //   confirmButtonColor: "#8B8BF5", // Purple color for confirm button
    //   cancelButtonColor: "#E97777", // Pink/red color for cancel button
    //   buttonsStyling: true,
    //   customClass: {
    //     popup: "rounded-4 shadow-lg",
    //     confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
    //     cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
    //     title: "fs-2 fw-normal mb-2",
    //   },
    //   width: "26em",
    //   padding: "2em",
    // });

    // if (result.isConfirmed) {
      const currentData = getCurrentTableData();
      const updatedData = data.filter((_: any, i: any) => i != index);
      if (updatedData.length) {
        setRowData(updatedData);
      }
    // }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={isOpenModal}
        onClose={() => toggleModal(false)}
        // TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => toggleModal(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="d-flex flex-column" style={{ height: '100vh' }}>
          {/* AG Grid Container */}
          <div
            className="ag-theme-alpine flex-grow-1"
            style={{ marginTop: '1rem', height: 'auto', width: '100%' }}
          >
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
                mode: 'multiRow',
              }}
              paginationPageSizeSelector={pageSizes}
              onGridReady={onGridReady}
            />
          </div>
  
          {/* Button Container */}
          <div className="d-flex justify-content-end p-2">
            <button className="btn btn-success" onClick={handleApproved}>
              Approve
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
  
})

export default LeadApprovalTable