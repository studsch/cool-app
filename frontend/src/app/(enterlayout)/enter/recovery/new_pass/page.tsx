import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import { Checkbox } from "@nextui-org/react";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import EnterToggleLink from "@/components/ui/links/enter-toggle-link";
import LogForm from "@/components/log-form/log-form";
import RegForm from "@/components/reg-form/reg-form";
import Link from "next/link";
import RecPassForm from "@/components/recovery-pass-form/recovery-pass-form";

export default function Enter() {
  return (
    <>
      <p className="text-text-primary-color h-12 font-light">
        Enter a new password, try to remember it.
      </p>
      <h2 className="text-text-primary-color h-14 text-xl">Password Reset</h2>
      <RecPassForm>
        {" "}
        <div className="h-2"></div>
        <Button
          type="submit"
          text="Update password"
          className="btn btn-primary"
        />
      </RecPassForm>
    </>
  );
}
