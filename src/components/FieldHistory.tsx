import React, { useEffect, useState } from "react";
import { Calendar, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { formatString } from "../utils/formatData";

interface HistoryItem {
  id: number;
  table_name: string;
  record_id: number;
  changed_by: number;
  change_type: "CREATE" | "UPDATE" | "DELETE";
  changed_at: string;
  changedBy: string;
  changes: Record<string, { old_value: string | number | null; new_value: string | number | null }>;
}

const FieldHistoryTable = ({ apiUrl, studentId }: any) => {
  console.log("apiUrl, studentId", apiUrl, studentId);

  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    if (apiUrl) fetchHistoryData();
  }, [apiUrl]);

  const fetchHistoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNoDataMessage(null);

      const response = await axios.get(`get_field_change_history?tableName=${apiUrl}&studentId=${studentId}`);
      if (response.data.message) {
        setNoDataMessage(response.data.message);
        setHistoryData([]);
        return;
      }

      if (Array.isArray(response.data.data)) {
        setHistoryData(response.data.data);
      } else {
        setNoDataMessage("No history records available");
        setHistoryData([]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred while fetching the history data");
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpandRow = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (date: string): string => new Date(date).toLocaleString();

  const filteredData = historyData.filter((item) => filterType === "all" || item.change_type === filterType);

  const renderExpandedContent = (item: HistoryItem) => {
    if (!expandedRows[item.id]) return null;

    return (
      <tr className="bg-light">
        <td colSpan={5}>
          <table className="table border table-sm mt-2 bg-white">
            <thead className={item.change_type === "DELETE" ? "table-danger" : "table-info"}>
              <tr>
                <th>Field</th>
                {item.change_type === "DELETE" ? (
                  <th>Deleted Value</th>
                ) : (
                  <>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {/* {historyData.map((item) =>
                Object.entries(item.changes ?? {}).map(([key, { old_value, new_value }]) => {
                  return (
                    <tr key={`${item.id}-${key}`} className={"table-warning"}>
                      <td className="fw-bold">{key}</td>
                      {item.change_type === "DELETE" ? (
                        <td className="text-danger fw-semibold">{old_value || "-"}</td>
                      ) : (
                        <>
                          <td className={"text-danger fw-semibold"}>{old_value || "-"}</td>
                          <td className={"text-success fw-semibold"}>{new_value || "-"}</td>
                        </>
                      )}
                    </tr>
                  );
                })
              )} */}

              {item.changes &&
                Object.entries(item.changes).map(([key, change]) => {
                  const oldValue = change?.old_value ?? "-"; // Default to "-"
                  const newValue = change?.new_value ?? "-";

                  return (
                    <tr key={`${item.id}-${key}`} className="table-warning">
                      <td className="fw-bold">{typeof key === "string" ? formatString(key) : key}</td>
                      {item.change_type === "DELETE" ? (
                        <td className="text-danger fw-semibold">{oldValue}</td>
                      ) : (
                        <>
                          <td className="text-danger fw-semibold">{oldValue}</td>
                          <td className="text-success fw-semibold">
                            {Array.isArray(newValue)
                              ? newValue.map((doc, index) => <div key={index}>{JSON.stringify(doc)}</div>)
                              : newValue}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </td>
      </tr>
    );
  };

  if (isLoading) return <Loader />;

  if (error) return <ErrorAlert message={error} />;

  if (noDataMessage) return <NoDataAlert message={noDataMessage} />;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h5">Change History</h2>
        <div className="d-flex gap-2">
          <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
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
                  <td>
                    <div
                      style={{
                        transform: expandedRows[item.id] ? "rotate(90deg)" : "rotate(0)",
                        transition: "transform 0.3s ease",
                        display: "inline-block",
                      }}
                    >
                      <ChevronRight size={16} />
                    </div>
                  </td>
                  <td>
                    <Calendar size={16} /> {formatDate(item.changed_at)}
                  </td>
                  <td>{item.record_id}</td>
                  <td>
                    <span className={`badge px-2 py-1 ${getBadgeClass(item.change_type)}`}>{item.change_type}</span>
                  </td>
                  <td>{item.changedBy}</td>
                </tr>
                {renderExpandedContent(item)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Loader = () => (
  <div className="text-center p-4">
    <Loader2 className="h-4 w-4 animate-spin me-2" />
    <span className="text-muted">Loading history data...</span>
  </div>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <div className="alert alert-danger d-flex align-items-center p-3">
    <AlertCircle className="h-4 w-4 me-2" />
    <span>{message}</span>
  </div>
);

const NoDataAlert = ({ message }: { message: string }) => (
  <div className="text-center text-muted p-4">
    <Calendar className="h-4 w-4 mb-2" />
    <p className="mb-0">{message}</p>
  </div>
);

const getBadgeClass = (changeType: string) => {
  switch (changeType) {
    case "CREATE":
      return "bg-success bg-opacity-75";
    case "UPDATE":
      return "bg-primary bg-opacity-75";
    case "DELETE":
      return "bg-danger bg-opacity-75";
    default:
      return "bg-secondary";
  }
};

export default FieldHistoryTable;
