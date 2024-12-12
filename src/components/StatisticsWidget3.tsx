import React from "react";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import classNames from "classnames";
import CountUp from "react-countup";

interface StatisticsWidgetProps {
  title: string;
  stats: string;
  trend?: {
    label: string;
    value: string;
    icon: string;
    trendStats: string;
    variant: string;
  };
  counterOptions?: any;
}

const StatisticsWidget3 = (props: StatisticsWidgetProps) => {
  return (
    <>
      <Card>
        <Card.Body>
          <h4 className="mt-0 font-16">{props["title"]}</h4>
          <h2 className="text-primary my-3 text-center">
            <span>
              <CountUp duration={1} end={props["stats"]} {...props["counterOptions"]} />
            </span>
          </h2>
        </Card.Body>
      </Card>
    </>
  );
};

export default StatisticsWidget3;
