import React from "react";
import CountUp from "react-countup";

type Props = {
  title: string;
  stats: string;
  icon: string;
  bgColor: string;
};

function IconCards({ icon, title, stats, bgColor }: Props) {
  return (
    <>
      <div className="widget-rounded-circle card">
        <div className="card-body">
          <div className="row">
            <div className="col-6">
              <div className="avatar-lg rounded-circle" style={{ backgroundColor: `${bgColor}` }}>
                <i className={`${icon} font-22 avatar-title text-dark`}></i>
              </div>
            </div>
            <div className="col-6">
              <div className="text-end">
                <h3 className="mt-1">
                  <span>
                    <CountUp duration={1} end={Number(stats)} />
                  </span>
                </h3>
                <p className="text-muted mb-1 text-truncate">{title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IconCards;
