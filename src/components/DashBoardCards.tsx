import React from "react";
import { Row } from "react-bootstrap";
import CountUp from "react-countup";

const DashBoardCards = () => {
  const cardItems = [
    { title: "Total Leads", value: 1000, icon: "users" },
    { title: "Pending Leads", value: 200, icon: "clock" },
    { title: "Assigned Leads", value: 500, icon: "user-check" },
    { title: "Spam Leads", value: 50, icon: "alert-triangle" },
  ];

  const xlValue = 12 / cardItems.length;

  return (
    <>
      <Row>
        {cardItems.map((item, index) => (
          <div key={index} className={`col-md-6 col-xl-${xlValue}`}>
            <div className="widget-rounded-circle card">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="avatar-md rounded-circle bg-soft-secondary  border">
                      <i
                        className={`fe-${item.icon} font-21 avatar-title text-primary`}
                      ></i>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex flex-column align-items-end">
                      <h3 className="text-primary mt-1">
                        <CountUp start={0} end={item.value} duration={1.75} />
                      </h3>
                      <h5 className="text-secondary mb-1 text-truncate">
                        {item.title}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Row>
    </>
  );
};

export default DashBoardCards;
