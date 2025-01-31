import React, { useEffect, useState } from "react";
import { Calendar, ChevronDown, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

interface HistoryItem {
  id: number;
  table_name: string;
  record_id: number;
  changed_by: number;
  change_type: "CREATE" | "UPDATE" | "DELETE";
  changed_at: string;
  changedBy: string;
  old_values: Record<string, string> | null;
  new_values: Record<string, string>;
}

const HistoryTable = ({ apiUrl }: any) => {
  const [filterTable, setFilterTable] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredData = historyData.filter(
    (item) =>
      (filterTable === "all" || item.table_name === filterTable) && 
      (filterType === "all" || item.change_type === filterType)
  );

  const formatDate = (date: string): string => new Date(date).toLocaleString();

  const toggleExpandRow = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchHistoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`get_table_history?tableName=${apiUrl}`);
      const data = await response.data.data;
      setHistoryData(data);
    } catch (error) {
      setError(
        error instanceof Error 
          ? error.message 
          : "An error occurred while fetching the history data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiUrl) fetchHistoryData();
  }, [apiUrl]);

  const renderExpandedContent = (item: HistoryItem) => {
    if (item.change_type === "DELETE") {
      return (
        <tr className="bg-light">
          <td colSpan={6}>
            <div className="alert alert-danger mt-2 mb-2">
              The following record was deleted:
            </div>
            <table
              className="table border table-sm mt-2 bg-white"
              style={{ borderRadius: "8px", borderCollapse: "separate", borderSpacing: "0" }}
            >
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Deleted Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(item.old_values ?? {}).map(([key, value]) => (
                  <tr key={key}>
                    <td className="text-capitalize">{key}</td>
                    <td>{value || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      );
    }

    return (
      <tr className="bg-light">
        <td colSpan={6}>
          <table
            className="table border table-sm mt-2 bg-white"
            style={{ borderRadius: "8px", borderCollapse: "separate", borderSpacing: "0" }}
          >
            <thead>
              <tr>
                <th>Field</th>
                <th>Old Value</th>
                <th>New Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(item.new_values ?? {}).map(([key, newValue]) => (
                <tr key={key}>
                  <td className="text-capitalize">{key}</td>
                  <td>{item.old_values?.[key] || "-"}</td>
                  <td>{newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    );
  };

  if (isLoading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body d-flex align-items-center justify-content-center p-4">
          <div className="text-center">
            <Loader2 className="h-4 w-4 animate-spin me-2" />
            <span className="text-muted">Loading history data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <AlertCircle className="h-4 w-4 me-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!historyData.length) {
    return (
      <div className="card shadow-sm">
        <div className="card-body d-flex align-items-center justify-content-center p-4">
          <div className="text-center text-muted">
            <Calendar className="h-4 w-4 mb-2" />
            <p className="mb-0">No history records found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h5">Change History</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Changes</option>
            <option value="CREATE">Created</option>
            <option value="UPDATE">Updated</option>
            <option value="DELETE">Deleted</option>
          </select>
        </div>
      </div>
      <div className="card-body">
        <table className="table border-1">
          <thead className="table-light">
            <tr>
              <th></th>
              <th>Date</th>
              <th>Record ID</th>
              <th>Change Type</th>
              <th>Changed By</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <React.Fragment key={item.id}>
                <tr onClick={() => toggleExpandRow(item.id)} style={{ cursor: "pointer" }}>
                  <td>{expandedRows[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</td>
                  <td>
                    <Calendar size={16} /> {formatDate(item.changed_at)}
                  </td>
                  <td>{item.record_id}</td>
                  <td>
                    <span
                      className={`badge badge-pill px-2 py-1 ${
                        item.change_type === "CREATE"
                          ? "bg-success bg-opacity-75"
                          : item.change_type === "UPDATE"
                          ? "bg-primary bg-opacity-75"
                          : "bg-danger bg-opacity-75"
                      }`}
                    >
                      {item.change_type}
                    </span>
                  </td>
                  <td>{item.changedBy}</td>
                </tr>
                {expandedRows[item.id] && renderExpandedContent(item)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;

// import React, { useEffect, useState } from "react";
// import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
// import axios from "axios";

// interface HistoryItem {
//   id: number;
//   table_name: string;
//   record_id: number;
//   changed_by: number;
//   change_type: "CREATE" | "UPDATE" | "DELETE";
//   changed_at: string;
//   changedBy: string;
//   old_values: Record<string, string> | null;
//   new_values: Record<string, string>;
// }

// const HistoryTable = ({ apiUrl }: any) => {
//   const [filterTable, setFilterTable] = useState<string>("all");
//   const [filterType, setFilterType] = useState<string>("all");
//   const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
//   const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

//   const filteredData = historyData.filter(
//     (item) =>
//       (filterTable === "all" || item.table_name === filterTable) && (filterType === "all" || item.change_type === filterType)
//   );

//   const formatDate = (date: string): string => new Date(date).toLocaleString();

//   const toggleExpandRow = (id: number) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const fetchHistoryData = async () => {
//     try {
//       const response = await axios.get(`get_table_history?tableName=${apiUrl}`);
//       const data = await response.data.data;
//       console.log("history data ==>", data);

//       setHistoryData(data);
//     } catch (error) {
//       console.log("Error fetching history data:", error);
//     }
//   };

//   useEffect(() => {
//     if (apiUrl) fetchHistoryData();
//   }, [apiUrl]);

//   return (
//     <div className="card shadow-sm">
//       <div className="card-header d-flex justify-content-between align-items-center">
//         <h2 className="h5">Change History</h2>
//         <div className="d-flex gap-2">
//           <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
//             <option value="all">All Changes</option>
//             <option value="CREATE">Created</option>
//             <option value="UPDATE">Updated</option>
//             <option value="DELETE">Deleted</option>
//           </select>
//         </div>
//       </div>
//       <div className="card-body">
//         <table className="table border-1">
//           <thead className="table-light">
//             <tr>
//               <th></th>
//               <th>Date</th>
//               {/* <th>Table</th> */}
//               <th>Record ID</th>
//               <th>Change Type</th>
//               <th>Changed By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData?.map((item) => (
//               <React.Fragment key={item.id}>
//                 <tr onClick={() => toggleExpandRow(item.id)} style={{ cursor: "pointer" }}>
//                   <td>{expandedRows[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</td>
//                   <td>
//                     <Calendar size={16} /> {formatDate(item.changed_at)}
//                   </td>
//                   <td>{item.record_id}</td>
//                   <td>
//                     <span
//                       className={`badge badge-pill px-2 py-1 ${
//                         item.change_type === "CREATE"
//                           ? "bg-success bg-opacity-75"
//                           : item.change_type === "UPDATE"
//                           ? "bg-primary bg-opacity-75"
//                           : "bg-danger bg-opacity-75"
//                       }`}
//                     >
//                       {item.change_type}
//                     </span>
//                   </td>
//                   <td>{item.changedBy}</td>
//                 </tr>
//                 {expandedRows[item?.id] && (
//                   <tr className="bg-light">
//                     <td colSpan={6}>
//                       <table
//                         className="table border table-sm mt-2 bg-white"
//                         style={{ borderRadius: "8px", borderCollapse: "separate", borderSpacing: "0" }}
//                       >
//                         <thead>
//                           <tr>
//                             <th>Field</th>
//                             <th>Old Value</th>
//                             <th>New Value</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {Object.entries(item?.new_values ?? {}).map(([key, newValue]) => (
//                             <tr key={key}>
//                               <td className="text-capitalize">{key}</td>
//                               <td>{item.old_values?.[key] || "-"}</td>
//                               <td>{newValue}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default HistoryTable;
