import React from "react";
import CountUp from "react-countup";
import { Tooltip } from "@mui/material";

type Props = {
  title: string;
  stats: string;
  icon: string;
  bgColor: string;
};

const slotProps = {
  popper: {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -34],
        },
      },
    ],
  },
};

function IconCards({ icon, title, stats, bgColor }: Props) {
  return (
    <>
      <div className="widget-rounded-circle card w-100">
        <div className="card-body">
          <Tooltip title={title} {...slotProps}>
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
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default IconCards;
