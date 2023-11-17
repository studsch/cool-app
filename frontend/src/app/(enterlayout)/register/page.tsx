import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import { Checkbox } from "@nextui-org/react";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import EnterToggleLink from "@/components/ui/links/enter-toggle-link";
import LogForm from "@/components/log-form/log-form";
import RegForm from "@/components/reg-form/reg-form";
import OtpForm from "@/components/otp-form/otp-form";
import Link from "next/link";
import ResentSmsButton from "@/components/resent-sms-button/resent-sms-button";

export default function Enter() {
  return (
    <div className="w-full h-[80vh] sm:w-1/2 2xl:w-[500px]  2xl:h-[640px]  sm:h-auto lg:w-[400px] m-auto flex relative z-10 shadow-3xl rounded-xl sm:rounded-md overflow-hidden">
      <div className="py-20 w-full px-unit-sm sm:px-unit-xl lg:px-unit-2xl h-full bg-white relative flex flex-col  overflow-auto ">
        <h1 className="w-0 h-0 overflow-hidden">Memories</h1>
        <MemoriesSign className="md:h-24 h-16 mx-auto" />
        <p>Check your phone for SMS</p>
        <h2>Phone notification</h2>
        <OtpForm>
          <ResentSmsButton />
          <Link href={"/support/sms_code"}>Did not recieve</Link>
        </OtpForm>
      </div>
    </div>
  );
}
