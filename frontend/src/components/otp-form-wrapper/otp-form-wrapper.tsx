"use client";
import React from "react";
import OtpForm from "../otp-form/otp-form";
import Link from "next/link";
import Timer from "../timer/timer";
import Button from "../ui/button/Button";
import { useState } from "react";
import { useConfirmCode } from "@/store";
import { Spinner } from "@nextui-org/react";

export default function OtpFormWrapper() {
  const [needReload, setNeedReload] = useState(false);
  const timeLimit = 60;
  const startTime = useConfirmCode(state => state.startTime);
  return startTime ? (
    <OtpForm>
      <div className="flex flex-col gap-3 relative !mt-4">
        <Timer
          time={
            (new Date().getTime() - Number(startTime)) / 1000 <= timeLimit
              ? timeLimit - (new Date().getTime() - Number(startTime)) / 1000
              : 0
          }
          className="mx-auto"
          needReload={needReload}
          setNeedReload={setNeedReload}
        />
        <Button
          disabled
          id="accept"
          type="submit"
          text="Accept"
          className="btn btn-primary disabled:btn-disabled"
        />
      </div>
      <Link
        href={"/support/sms_code"}
        className="hover:underline cursor-pointer inline-block !mt-4 text-link-primary-color text-base font-light"
      >
        Did not recieve
      </Link>
    </OtpForm>
  ) : (
    <Spinner className="flex mt-4" />
  );
}
