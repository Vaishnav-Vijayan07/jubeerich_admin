import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles
import { Col, Row } from "react-bootstrap";
import IconCards from "./IconCards"; // Replace with your actual IconCards import
import { formatString } from "../../../utils/formatData";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


type StatCardsItem = {
  id: number;
  title: string;
  stats: string;
  icon: string;
  bgColor: string;
};

type Props = {
  statCardsItems: StatCardsItem[];
  role?: string;
};
const StatCards = ({ statCardsItems, role }: Props) => {
  const renderCard = () => {
    switch (role) {
      case "Application Manager":
      case "Application Team":
        return (
          <>
            <Swiper modules={[Navigation, Pagination]} spaceBetween={5} slidesPerView={6}>
              {statCardsItems.map((item: StatCardsItem) => (
                <SwiperSlide key={item.id}>
                  <Row className="justify-content-center">
                    <IconCards title={formatString(item.title)} stats={item.stats} icon={item.icon} bgColor={item.bgColor} />
                  </Row>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        );
      default:
        return (
          <>
            <Row classname="justify-content-between">
              {statCardsItems.map((item) => (
                <Col mx={1} key={item.id} className="mb-3">
                  <IconCards title={formatString(item.title)} stats={item.stats} icon={item.icon} bgColor={item.bgColor} />
                </Col>
              ))}
            </Row>
          </>
        );
    }
  };

  return <>{renderCard()}</>;
};

export default StatCards;
