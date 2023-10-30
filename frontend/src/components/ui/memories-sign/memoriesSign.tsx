import React from "react";
import Image from "next/image";

const MemoriesSign = () => {
  return (
    <article className="flex md:gap-1 gap-0.5 items-center">
      <span className="md:text-3xl text-xl font-bold text-text-rep-primary-color">
        Mem
      </span>
      <div className="md:w-9 md:h-12 w-6 h-8 relative">
        <Image
          src="http://localhost:3000/photoapp.png"
          alt="photoapp icon"
          fill
        ></Image>
      </div>
      <span className="md:text-3xl text-xl font-bold text-text-rep-primary-color">
        ries
      </span>
    </article>
  );
};

export default MemoriesSign;
