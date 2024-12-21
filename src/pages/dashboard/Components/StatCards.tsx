import React from "react";
import { Col, Row } from "react-bootstrap";
import IconCards from "./IconCards";
import { capitalizeFirstChar } from "../../../utils/formatData";

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
          <Col md={2} key={item.id}>
            <IconCards title={capitalizeFirstChar(item.title)} stats={item.stats} icon={item.icon} bgColor={item.bgColor}/>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default StatCards;
