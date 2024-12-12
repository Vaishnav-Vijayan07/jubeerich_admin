import React from "react";
import { Col, Row } from "react-bootstrap";
import IconCards from "./IconCards";

type StatCardsItem = {
  id: number;
  title: string;
  stats: string;
  icon: string;
  bgColor: string;
};

type Props = {
  statCardsItems: StatCardsItem[];
};

function StatCards({ statCardsItems }: Props) {
  return (
    <>
      <Row>
        {statCardsItems.map((item) => (
          <Col md={3} key={item.id}>
            <IconCards title={item.title} stats={item.stats} icon={item.icon} bgColor={item.bgColor}/>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default StatCards;
