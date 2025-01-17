import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles
import { Row } from "react-bootstrap";
import IconCards from "./IconCards"; // Replace with your actual IconCards import
import { formatString } from "../../../utils/formatData";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

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
const StatCards = ({ statCardsItems }: Props) => {
  return (
    <>
      <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} spaceBetween={20} slidesPerView={4}>
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
};

export default StatCards;
