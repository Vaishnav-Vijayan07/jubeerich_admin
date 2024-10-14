import React from "react";

const History = ({ studentId }: any) => {
  return (
    <div className="history-tl-container">
      <ul className="tl">
        <li className="tl-item" ng-repeat="item in retailer_history">
          <div className="item-title">All History</div>
        </li>
        <li className="tl-item" ng-repeat="item in retailer_history">
          <div className="item-title">lorem ipsum dolor set amet</div>
          <div className="timestamp">16/08/2025</div>
        </li>
        <li className="tl-item" ng-repeat="item in retailer_history">
          <div className="item-title">lorem ipsum dolor set amet</div>
          <div className="timestamp">16/08/2025</div>
        </li>
        <li className="tl-item" ng-repeat="item in retailer_history">
          <div className="item-title">lorem ipsum dolor set amet</div>
          <div className="timestamp">16/08/2025</div>
        </li>
        <li className="tl-item" ng-repeat="item in retailer_history">
          <div className="item-title">lorem ipsum dolor set amet</div>
          <div className="timestamp">16/08/2025</div>
        </li>
        <li className="tl-item" ng-repeat="item in retailer_history">
          <div className="item-title">lorem ipsum dolor set amet</div>
          <div className="timestamp">16/08/2025</div>
        </li>
      </ul>
    </div>
  );
};

export default History;
