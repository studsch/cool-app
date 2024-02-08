import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import { Checkbox } from "@nextui-org/react";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import EnterToggleLink from "@/components/ui/links/enter-toggle-link";
import LogForm from "@/components/log-form/log-form";
import RegForm from "@/components/reg-form/reg-form";
import Link from "next/link";
import PhoneForm from "@/components/phone-form/phone-form";

export default function Enter() {
  return (
    <>
      <p className="text-text-primary-color h-12 font-light">
        Take the phone to reset
      </p>
      <h2 className="text-text-primary-color h-14 text-xl">
        Password Recovery
      </h2>
      <PhoneForm>
        {" "}
        <div className="h-4"></div>
      </PhoneForm>
    </>
  );
}
