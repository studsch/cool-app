import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import { Checkbox } from "@nextui-org/react";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import EnterToggleLink from "@/components/ui/links/enter-toggle-link";
import LogFormPhone from "@/components/log-form/log-form-phone";
import RegForm from "@/components/reg-form/reg-form";
import Link from "next/link";
import PhoneForm from "@/components/phone-form/phone-form";
import DragDropPreview from "@/components/ui/dragdroppreview";

export default function Enter() {
  return (
    <>
      <div>
        <div className="w-full flex flex-col">
          <p className="h-5 md:h-6 sm:h-4 text-center text-sm font-light text-text-reg-secondary-color">
            Enter with phone
          </p>
          <p className="h-12 md:h-16 sm:h-12 text-center text-2xl text-text-reg-secondary-color">
            Welcome back!
          </p>
          <LogFormPhone></LogFormPhone>
        </div>
      </div>
    </>
  );
}
