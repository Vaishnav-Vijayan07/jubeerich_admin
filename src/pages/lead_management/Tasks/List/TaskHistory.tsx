import axios from "axios";
import React, { useEffect, useState } from "react";
import { handleDateFormat } from "../../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { getHistoryByLeadId } from "../../../../redux/actions";
import { RootState } from "../../../../redux/store";

const TaskHistory = ({ leadId }: any) => {
  console.log("leadId", leadId);

  const [historyData, setHistoryData] = useState([]);
  const dispatch = useDispatch();

  const Histories = useSelector((state: RootState) => state?.History.leadHistory.data?.data);

  useEffect(() => {
    if (leadId) {
      dispatch(getHistoryByLeadId(leadId));
    }
  }, [leadId]);

  useEffect(() => {
    if (Histories) {
      const HistoryEntry = Histories?.map((item: any) => {
        let sentence = ``;
        if (item.status) {
          sentence += `status changed to "${item.status}". `;
        }
        if (item.comments) {
          sentence += `Added comment "${item.comments.slice(0, 20)}". `;
        }
        if (item.checklist) {
          sentence += `Checklist status updated "${item.checklist}". `;
        }
        if (item.follow_up_date) {
          sentence += `Follow up date updated to "${handleDateFormat(item.follow_up_date)}". `;
        }

        return { sentence: sentence.trim(), date: extractDate(item.created_at), time: extractTime(item.created_at) };
      });

      setHistoryData(HistoryEntry);
    }
  }, [Histories]);

  function extractDate(dateString: string) {
    // Parse the string into a Date object
    const dateObject = new Date(dateString);

    // Extract the date and time components
    const date = dateObject?.toDateString(); // Extract the date

    return date;
  }

  function extractTime(dateString: string) {
    // Parse the string into a Date object
    const dateObject = new Date(dateString);

    // Extract the date and time components
    const time = dateObject.toLocaleTimeString(); // Extract the date

    return time;
  }

  return (
    <>
      <div className="history-tl-container">
        <ul className="tl">
          {Histories?.length > 0 && (
            <li className="tl-item" ng-repeat="item in retailer_history">
              <div className="item-title">Today</div>
            </li>
          )}
          {historyData?.map((item: any, index: number) => (
            <li key={index} className="tl-item" ng-repeat="item in retailer_history">
              <div className="item-title">{item.sentence}</div>
              <div className="timestamp">{item.time}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TaskHistory;
