import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultTheme } from '../../AgGridSetup';
import { AgGridReact } from 'ag-grid-react';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Slide, Toolbar } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import RefreshConfirmation from '../../components/RefreshConfirmation';
import axios from 'axios';
import { GridApi, GridReadyEvent, IRowNode, RowNode } from 'ag-grid-community';
import { showSuccessAlert } from '../../constants';

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

const LeadApprovalTable = ({ isOpenModal, toggleModal, responseData, options }: any) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const pageSizes = [10, 20, 50, 100];
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
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
      { field: 'error', headerName: 'Error', sortable: true, filter: true, editable: true, sortIndex: 0, sort: 'desc'},
      // {
      //   field: 'delete',
      //   headerName: 'Actions',
      //   cellRenderer: (params: any) => {
      //     return (
      //       <span>
      //         <i onClick={() => {
      //           const index = params.node.rowIndex;
      //           handleDeleteRow(index, rowData);
      //         }}
      //           className='mdi mdi-delete-outline fs-4'></i>
      //       </span>
      //     );
      //   },
      //   width: 100,
      //   sortable: false,
      //   filter: false,
      //   editable: false
      // }
    ])
  }

  const onSelectionChanged = (params: any) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    setSelectedItems(selectedData);
  };

  const handleApproved = async () => {
    console.log('selectedItems', selectedItems);
    const currentData = getCurrentTableData();
    console.log('currentData', currentData);

    try {
      const { data } = await axios.post('/approve_leads', { lead_data: selectedItems });
      console.log('Response', data);
      if(data) {
        showSuccessAlert('Selected Leads Succesfully Approved')
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  const getCurrentTableData = useCallback(() => {
    if (!gridApi) return [];

    const currentData: any[] = [];
    gridApi.forEachNode((rowNode: IRowNode, index: number) => {
      currentData.push(rowNode.data);
    });

    return currentData;
  }, [gridApi]);

  const handleDeleteRow = (index: number, data: any) => {
    console.log('index', index);
    const currentData = getCurrentTableData();
    console.log('currentData', currentData);

    const updatedData = currentData.filter((_, i) => i != index);
    console.log('updatedData', updatedData);
    // setRowData(updatedData);

    // if(rowData.length && updatedData.length) {
    //   setRowData(updatedData);
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
        <div className='ag-theme-alpine' style={{ marginTop: '1rem', height: 450, width: '100%' }}>
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
              mode: 'multiRow'
            }}
            paginationPageSizeSelector={pageSizes}
            onGridReady={onGridReady}
          />
          <div className='d-flex justify-content-end me-2 mt-2'>
            <button className='btn btn-success' onClick={handleApproved}>
              Approve
            </button>
          </div>
        </div>
      </Dialog>

      {/* {responseData && <RefreshConfirmation />} */}
    </>
  )
}

export default LeadApprovalTable