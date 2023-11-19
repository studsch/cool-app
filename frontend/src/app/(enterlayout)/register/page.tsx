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
import OtpFormWrapper from "@/components/otp-form-wrapper/otp-form-wrapper";
export default function Enter() {
  return (
    <>
      <p className="text-text-primary-color h-8 font-light">
        Check your phone for SMS
      </p>
      <h2 className="text-text-primary-color h-14 text-xl">
        Phone notification
      </h2>
      <OtpFormWrapper />
    </>
  );
}
