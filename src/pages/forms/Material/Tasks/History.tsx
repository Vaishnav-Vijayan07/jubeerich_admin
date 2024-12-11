import React from "react";

const History = () => {
  return (
    <div className="history_container">
      <div className="history_heading">
        <h5>HISTORY</h5>
      </div>

      <div className="history_items">
        {/* history */}
        <div className="swiper-slide" style={{ marginTop: "3px" }}>
          <div className="timestamp">
            <span className="date">History</span>
          </div>
          <div className="status">
            <span></span>
          </div>
        </div>

        <div className="swiper-slide">
          <div className="timestamp">
            <span className="date">Flag updated to Medium by CRE</span>
          </div>
          <div className="status">
            <span>Nov 29 / 2024</span>
          </div>
        </div>

        <div className="swiper-slide">
          <div className="timestamp">
            <span className="date">Flag updated to Cold by CRE</span>
          </div>
          <div className="status">
            <span>Nov 29 / 2024</span>
          </div>
        </div>

        <div className="swiper-slide">
          <div className="timestamp">
            <span className="date">Flag updated to Cold by CRE</span>
          </div>
          <div className="status">
            <span>Nov 29 / 2024</span>
          </div>
        </div>

        <div className="swiper-slide">
          <div className="timestamp">
            <span className="date">Flag updated to Cold by CRE</span>
          </div>
          <div className="status">
            <span>Nov 29 / 2024</span>
          </div>
        </div>

        <div className="swiper-slide">
          <div className="timestamp">
            <span className="date">Flag updated to Cold by CRE</span>
          </div>
          <div className="status">
            <span>Nov 29 / 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
