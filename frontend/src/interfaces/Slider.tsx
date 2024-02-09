import { ReactNode } from "react";
import { SwiperOptions } from "swiper/types";

interface SliderProps {
  className?: string;
  spaceBetween: number;
  breakpoints?:
    | {
        [width: number]: SwiperOptions;
        [ratio: string]: SwiperOptions;
      }
    | undefined;
  slidesPerView: number | "auto";
  data?: React.ReactElement[] | ReactNode[];
  errMsg?: string;
}

export default SliderProps;
