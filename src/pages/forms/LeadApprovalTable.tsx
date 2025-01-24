import React, { useState } from 'react';
import { defaultTheme } from '../../AgGridSetup';
import { AgGridReact } from 'ag-grid-react';

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
  isEditable?: boolean;
}

const LeadApprovalTable = () => {
  const [rowData, setRowData] = useState<IRowData[]>([
    { id: 1, source: 'Website', channel: 'Email', name: 'John Doe', email: 'john@example.com', phone: '1234567890', city: 'New York', officeType: 'Headquarters', region: 'East', country: 'USA', ielts: true, error: null },
    { id: 2, source: 'Referral', channel: 'Phone', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', city: 'Los Angeles', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 3, source: 'Advertisement', channel: 'Social Media', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', city: 'Chicago', officeType: 'Branch', region: 'Midwest', country: 'USA', ielts: true, error: null },
    { id: 4, source: 'Website', channel: 'Email', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', city: 'Houston', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: false, error: null },
    { id: 5, source: 'Referral', channel: 'Phone', name: 'Charlie Davis', email: 'charlie@example.com', phone: '3344556677', city: 'Phoenix', officeType: 'Branch', region: 'West', country: 'USA', ielts: true, error: null },
    { id: 6, source: 'Advertisement', channel: 'Social Media', name: 'David Evans', email: 'david@example.com', phone: '4455667788', city: 'Philadelphia', officeType: 'Branch', region: 'East', country: 'USA', ielts: false, error: null },
    { id: 7, source: 'Website', channel: 'Email', name: 'Emma Harris', email: 'emma@example.com', phone: '5566778899', city: 'San Antonio', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 8, source: 'Referral', channel: 'Phone', name: 'Frank Green', email: 'frank@example.com', phone: '6677889900', city: 'San Diego', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 9, source: 'Advertisement', channel: 'Social Media', name: 'Grace Hill', email: 'grace@example.com', phone: '7788990011', city: 'Dallas', officeType: 'Branch', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 10, source: 'Website', channel: 'Email', name: 'Henry Jackson', email: 'henry@example.com', phone: '8899001122', city: 'San Jose', officeType: 'Headquarters', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 11, source: 'Website', channel: 'Email', name: 'John Doe', email: 'john@example.com', phone: '1234567890', city: 'New York', officeType: 'Headquarters', region: 'East', country: 'USA', ielts: true, error: null },
    { id: 12, source: 'Referral', channel: 'Phone', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', city: 'Los Angeles', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 13, source: 'Advertisement', channel: 'Social Media', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', city: 'Chicago', officeType: 'Branch', region: 'Midwest', country: 'USA', ielts: true, error: null },
    { id: 14, source: 'Website', channel: 'Email', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', city: 'Houston', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: false, error: null },
    { id: 15, source: 'Referral', channel: 'Phone', name: 'Charlie Davis', email: 'charlie@example.com', phone: '3344556677', city: 'Phoenix', officeType: 'Branch', region: 'West', country: 'USA', ielts: true, error: null },
    { id: 16, source: 'Advertisement', channel: 'Social Media', name: 'David Evans', email: 'david@example.com', phone: '4455667788', city: 'Philadelphia', officeType: 'Branch', region: 'East', country: 'USA', ielts: false, error: null },
    { id: 17, source: 'Website', channel: 'Email', name: 'Emma Harris', email: 'emma@example.com', phone: '5566778899', city: 'San Antonio', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 18, source: 'Referral', channel: 'Phone', name: 'Frank Green', email: 'frank@example.com', phone: '6677889900', city: 'San Diego', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 19, source: 'Advertisement', channel: 'Social Media', name: 'Grace Hill', email: 'grace@example.com', phone: '7788990011', city: 'Dallas', officeType: 'Branch', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 20, source: 'Website', channel: 'Email', name: 'Henry Jackson', email: 'henry@example.com', phone: '8899001122', city: 'San Jose', officeType: 'Headquarters', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 21, source: 'Website', channel: 'Email', name: 'John Doe', email: 'john@example.com', phone: '1234567890', city: 'New York', officeType: 'Headquarters', region: 'East', country: 'USA', ielts: true, error: null },
    { id: 22, source: 'Referral', channel: 'Phone', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', city: 'Los Angeles', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 23, source: 'Advertisement', channel: 'Social Media', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', city: 'Chicago', officeType: 'Branch', region: 'Midwest', country: 'USA', ielts: true, error: null },
    { id: 24, source: 'Website', channel: 'Email', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', city: 'Houston', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: false, error: null },
    { id: 25, source: 'Referral', channel: 'Phone', name: 'Charlie Davis', email: 'charlie@example.com', phone: '3344556677', city: 'Phoenix', officeType: 'Branch', region: 'West', country: 'USA', ielts: true, error: null },
    { id: 26, source: 'Advertisement', channel: 'Social Media', name: 'David Evans', email: 'david@example.com', phone: '4455667788', city: 'Philadelphia', officeType: 'Branch', region: 'East', country: 'USA', ielts: false, error: null },
    { id: 27, source: 'Website', channel: 'Email', name: 'Emma Harris', email: 'emma@example.com', phone: '5566778899', city: 'San Antonio', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 28, source: 'Referral', channel: 'Phone', name: 'Frank Green', email: 'frank@example.com', phone: '6677889900', city: 'San Diego', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 29, source: 'Advertisement', channel: 'Social Media', name: 'Grace Hill', email: 'grace@example.com', phone: '7788990011', city: 'Dallas', officeType: 'Branch', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 30, source: 'Website', channel: 'Email', name: 'Henry Jackson', email: 'henry@example.com', phone: '8899001122', city: 'San Jose', officeType: 'Headquarters', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 31, source: 'Website', channel: 'Email', name: 'John Doe', email: 'john@example.com', phone: '1234567890', city: 'New York', officeType: 'Headquarters', region: 'East', country: 'USA', ielts: true, error: null },
    { id: 32, source: 'Referral', channel: 'Phone', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', city: 'Los Angeles', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 33, source: 'Advertisement', channel: 'Social Media', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', city: 'Chicago', officeType: 'Branch', region: 'Midwest', country: 'USA', ielts: true, error: null },
    { id: 34, source: 'Website', channel: 'Email', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', city: 'Houston', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: false, error: null },
    { id: 35, source: 'Referral', channel: 'Phone', name: 'Charlie Davis', email: 'charlie@example.com', phone: '3344556677', city: 'Phoenix', officeType: 'Branch', region: 'West', country: 'USA', ielts: true, error: null },
    { id: 36, source: 'Advertisement', channel: 'Social Media', name: 'David Evans', email: 'david@example.com', phone: '4455667788', city: 'Philadelphia', officeType: 'Branch', region: 'East', country: 'USA', ielts: false, error: null },
    { id: 37, source: 'Website', channel: 'Email', name: 'Emma Harris', email: 'emma@example.com', phone: '5566778899', city: 'San Antonio', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 38, source: 'Referral', channel: 'Phone', name: 'Frank Green', email: 'frank@example.com', phone: '6677889900', city: 'San Diego', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 39, source: 'Advertisement', channel: 'Social Media', name: 'Grace Hill', email: 'grace@example.com', phone: '7788990011', city: 'Dallas', officeType: 'Branch', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 40, source: 'Website', channel: 'Email', name: 'Henry Jackson', email: 'henry@example.com', phone: '8899001122', city: 'San Jose', officeType: 'Headquarters', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 41, source: 'Website', channel: 'Email', name: 'John Doe', email: 'john@example.com', phone: '1234567890', city: 'New York', officeType: 'Headquarters', region: 'East', country: 'USA', ielts: true, error: null },
    { id: 42, source: 'Referral', channel: 'Phone', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', city: 'Los Angeles', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 43, source: 'Advertisement', channel: 'Social Media', name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', city: 'Chicago', officeType: 'Branch', region: 'Midwest', country: 'USA', ielts: true, error: null },
    { id: 44, source: 'Website', channel: 'Email', name: 'Bob Brown', email: 'bob@example.com', phone: '2233445566', city: 'Houston', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: false, error: null },
    { id: 45, source: 'Referral', channel: 'Phone', name: 'Charlie Davis', email: 'charlie@example.com', phone: '3344556677', city: 'Phoenix', officeType: 'Branch', region: 'West', country: 'USA', ielts: true, error: null },
    { id: 46, source: 'Advertisement', channel: 'Social Media', name: 'David Evans', email: 'david@example.com', phone: '4455667788', city: 'Philadelphia', officeType: 'Branch', region: 'East', country: 'USA', ielts: false, error: null },
    { id: 47, source: 'Website', channel: 'Email', name: 'Emma Harris', email: 'emma@example.com', phone: '5566778899', city: 'San Antonio', officeType: 'Headquarters', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 48, source: 'Referral', channel: 'Phone', name: 'Frank Green', email: 'frank@example.com', phone: '6677889900', city: 'San Diego', officeType: 'Branch', region: 'West', country: 'USA', ielts: false, error: null },
    { id: 49, source: 'Advertisement', channel: 'Social Media', name: 'Grace Hill', email: 'grace@example.com', phone: '7788990011', city: 'Dallas', officeType: 'Branch', region: 'South', country: 'USA', ielts: true, error: null },
    { id: 50, source: 'Website', channel: 'Email', name: 'Henry Jackson', email: 'henry@example.com', phone: '8899001122', city: 'San Jose', officeType: 'Headquarters', region: 'West', country: 'USA', ielts: false, error: null },
  ]);
  const [columnDefs] = useState<any[]>([
    { field: 'id', headerName: 'ID', sortable: true, filter: true, editable: true },
    { field: 'source', headerName: 'Source', sortable: true, filter: true, editable: true },
    { field: 'channel', headerName: 'Channel', sortable: true, filter: true, editable: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true, editable: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true, editable: true },
    { field: 'phone', headerName: 'Phone', sortable: true, filter: true, editable: true },
    { field: 'city', headerName: 'City', sortable: true, filter: true, editable: true },
    { field: 'officeType', headerName: 'Office Type', sortable: true, filter: true, editable: true },
    { field: 'region', headerName: 'Region', sortable: true, filter: true, editable: true },
    { field: 'country', headerName: 'Country', sortable: true, filter: true, editable: true },
    {
      field: "ielts",
      headerName: "IELTS",
      cellRenderer: (params: any) => {
        const { data } = params;
        if (data.isEditable) {
          return (
            <input
              type="checkbox"
              className='ms-2 form-check-label'
              checked={data.ielts}
              onChange={() => handleCheckboxChange(data.id)}
            />
          );
        }
        return (
          <div
            onDoubleClick={() => handleIeltsDoubleClick(data.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {data.ielts ? (
              <i className="mdi mdi-check fs-3"></i>
            ) : (
              <i className="mdi mdi-close fs-3"></i>
            )}
          </div>
        );
      },
    },
    { field: 'error', headerName: 'Error', sortable: true, filter: true, editable: true, initialValue: null },
  ]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const pageSizes = [10, 20, 50, 100];

  const handleIeltsDoubleClick = (id: any) => {
    const updatedData = rowData.map((row: any) => row.id == id ? { ...row, isEditable: true } : row);
    setRowData(updatedData);
  };

  const handleCheckboxChange = (id: number) => {
    const updatedData = rowData.map((row) =>
      row.id === id ? { ...row, ielts: !row.ielts, isEditable: false } : row
    );
    setRowData(updatedData);
  };

  const onSelectionChanged = (params: any) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    console.log('Selected Rows:', selectedData);
    setSelectedItems(selectedData);
  };

  const handleApproved = () => {
    console.log('selectedItems',selectedItems);
  }

  return (
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
      />
      <div className='d-flex justify-content-end mt-2'>
        <button className='btn btn-success' onClick={handleApproved}>
          Approve
        </button>
      </div>
    </div>
  )
}

export default LeadApprovalTable