import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";
import { NextPage } from "next";
import MemoriesSign from "@/components/memories-sign/memoriesSign";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full   !min-h-auto sm:w-[460px] 2xl:w-[540px]  2xl:h-auto  sm:h-auto md:w-[500px] m-auto  relative z-10 shadow-3xl rounded-xl sm:rounded-md overflow-hidden ">
      <div className="py-[8vh] sm:py-20 w-full px-unit-sm sm:px-unit-xl lg:px-unit-2xl h-full relative flex flex-col my-auto  bg-white   ">
        <h1 className="w-0 h-0 overflow-hidden">Memories</h1>
        <MemoriesSign className="h-24 mx-auto" />
        {children}
      </div>
    </div>
  );
}
