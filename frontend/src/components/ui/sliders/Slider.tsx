"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

// import required modules
import { Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

import "./styles.css";
import SliderProps from "@/interfaces/Slider";

export default function Slider(props: SliderProps) {
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
  return (
    <>
      <Swiper
        onSwiper={setSwiperRef}
        slidesPerView={3}
        spaceBetween={30}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {props.data?.map((element, index) => (
          <SwiperSlide key={index}>{element}</SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

// "use client";

// import React, { useRef, useState } from "react";
// import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import "./styles.css";
// import Slide from "./Slide";
// // import required modules
// import { Pagination, Navigation } from "swiper/modules";

// // Import Swiper styles
// import "swiper/css";

// import "./styles.css";
// import SliderProps from "@/interfaces/Slider";

// export default function Slider(props: SliderProps) {
//   const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
//   const slides = <Slide data={props.data}></Slide>;
//   return (
//     <>
//       {props.data && props.data.length > 0 ? (
//         <Swiper
//           onSwiper={setSwiperRef}
//           slidesPerView={3}
//           spaceBetween={30}
//           navigation={true}
//           modules={[Navigation]}
//           className="mySwiper"
//         >
//           {slides}
//         </Swiper>
//       ) : (
//         <div className="h-20, w-20 bg-black">{props.errMsg}</div>
//       )}
//     </>
//   );
// }
