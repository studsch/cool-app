'use client'
import {DatePicker} from "@/components/ui/calendari/calendar";
import "@/components/ui/calendari/page.css";
import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";

export default function Home() {
  return (
    <>
      <NonRegLayout>
        <div>
          <DatePicker />
        </div>
        <div></div>
      </NonRegLayout>
    </>
  );
}