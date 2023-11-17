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
    <div className="w-full h-[80vh] sm:w-[460px] 2xl:w-[540px]  2xl:h-auto  sm:h-auto md:w-[500px] m-auto flex relative z-10 shadow-3xl rounded-xl sm:rounded-md overflow-hidden">
      <div className="py-20 w-full px-unit-sm sm:px-unit-xl lg:px-unit-2xl h-full relative flex flex-col justify-center  bg-white  overflow-auto ">
        <h1 className="w-0 h-0 overflow-hidden">Memories</h1>
        <MemoriesSign className="h-24 mx-auto" />
        <p className="text-text-primary-color h-8 font-light">
          Check your phone for SMS
        </p>
        <h2 className="text-text-primary-color h-14 text-xl">
          Phone notification
        </h2>
        <OtpForm>
          <ResentSmsButton className="hover:underline cursor-pointer text-link-primary-color text-base font-light" />
          <Link
            href={"/support/sms_code"}
            className="hover:underline cursor-pointer text-link-primary-color text-base font-light"
          >
            Did not recieve
          </Link>
        </OtpForm>
      </div>
    </div>
  );
}
