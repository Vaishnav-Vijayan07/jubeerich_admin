import axios from "axios";
import React, { useEffect } from "react";
import { showErrorAlert } from "../../../../constants";
import { Badge, Spinner } from "react-bootstrap";

const History = ({ studentId }: { studentId: number }) => {
  const [userHistory, setUserHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`lead_history/${studentId}`);
      setUserHistory(data.data); // Assuming the API response structure is { success: true, data: [...] }
    } catch (error) {
      console.log(error);
      showErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchDetails();
    }
  }, [studentId]);

  if (loading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "45%" }}
      />
    );
  }

  return (
    <div className="history-tl-container">
      <ul className="tl">
        {userHistory?.map((item) => (
          <li key={item.id} className="tl-item">
            <div className="item-title">{item.action}</div>
            <Badge>{item?.country ? item?.country?.country_name : null}</Badge>
            <div className="timestamp">
              {new Date(item.updated_on).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
