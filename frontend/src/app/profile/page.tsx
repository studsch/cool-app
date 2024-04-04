// "use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import Checkbox from "@/components/ui/checkbox/checkbox";
import Radiobutton from "@/components/ui/radiobutton/radiobutton";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import NonRegLayout from "@/components/layouts/layout-main-nonreg/NonRegLayout";
import RegForm from "@/components/reg-form/reg-form";
import LogForm from "@/components/log-form/log-form";
import LogOutButton from "@/components/log-out-button/log-out-button";
// import { useSession } from "next-auth/react";
import data from "@/test_data/slider/slider";

export default function Home() {
  //пример использования
  // const { data: session, status, update } = useSession();
  // console.log(session);
  // update({ user: { ...session?.user, name: "timur" } }); можно еще использовать await судя по видео с ютуба
  return (
    <>
      <div>
        profile
        <LogOutButton className="input input-secondary" type="button" />
      </div>
    </>
  );
}
