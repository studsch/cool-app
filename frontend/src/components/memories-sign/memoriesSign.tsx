import React from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  className?: string;
};

const MemoriesSign: React.FC<Props> = props => {
  return (
    <Link
      href="/"
      className={`${props.className} flex md:gap-1 gap-0.5 items-start`}
    >
      <span className="md:pt-[10px] md:text-4xl sm:text-2xl text-3xl font-bold text-text-reg-primary-color">
        Mem
      </span>
      <div className="md:w-11 md:h-[60px] sm:w-7 sm:h-9 w-8 h-10 relative">
        <Image
          src="http://localhost:3000/photoapp.png"
          alt="photoapp icon"
          fill
        ></Image>
      </div>
      <span className="md:pt-[10px] md:text-4xl sm:text-2xl text-3xl font-bold text-text-reg-primary-color">
        ries
      </span>
    </Link>
  );
};

export default MemoriesSign;
