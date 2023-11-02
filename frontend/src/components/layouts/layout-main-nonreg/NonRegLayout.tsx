import type { Metadata } from "next";
import Image from "next/image";
import "./NonRegLayout.scss";
// шрифты

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function NonRegLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-cover bg-[url('/reg-gray-linear.png')] h-full">
      {/* <div className="absolute w-full h-full z-0">
        <Image
          src="http://localhost:3000/reg-gray-linear.png"
          fill
          priority
          alt="reg-gray-linear"
        />
      </div> */}
      <div className="container sm:px-auto relative h-full w-full m-auto py-1 flex justify-center">
        {children}
      </div>
      <div className="fixed md:w-[110vw] w-[790px] sm:w-[800px] z-0 md:h-[12vh] xl:h-[25vh] h-[10vh] min-h-[100px] bottom-0 left-[-10px]">
        <Image
          priority
          src="http://localhost:3000/reg-pink-linear.png"
          fill
          alt="reg-pink-linear"
        />
      </div>
    </main>
  );
}
