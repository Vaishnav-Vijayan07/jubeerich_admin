import React from "react";
import { Row, Col } from "react-bootstrap";

// componets
import StatisticsWidget4 from "../../../components/StatisticsWidget4";

import avatar1 from "../../../assets/images/users/user-3.jpg";
import avatar2 from "../../../assets/images/users/user-4.jpg";
import avatar3 from "../../../assets/images/users/user-5.jpg";
import avatar4 from "../../../assets/images/users/user-6.jpg";
import { baseUrl } from "../../../constants";

const Statistics = ({ data }: any) => {
  return (
    <>
      <Row>
        {data?.map((item: any) => (
          <Col md={6} xl={3}>
            <StatisticsWidget4 avatar={`${baseUrl}/${item.profile_image_path}`} name={item.name} position={"executive"} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Statistics;
