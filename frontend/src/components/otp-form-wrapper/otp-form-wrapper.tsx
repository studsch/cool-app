"use client";
import React, { useEffect } from "react";
import OtpForm from "../otp-form/otp-form";
import Link from "next/link";
import Timer from "../timer/timer";
import Button from "../ui/button/Button";
import { useState } from "react";
import { useConfirmCode, useConfirmCodeRecovery } from "@/store";
import { Spinner } from "@nextui-org/react";
import RegError from "../errors/reg-error";
import { useTranslations } from "next-intl";

export default function OtpFormWrapper({
  children,
  type,
  pushRoute,
}: {
  children: React.ReactNode;
  type: number;
  pushRoute: string;
}) {
  const [needReload, setNeedReload] = useState(false);
  const t = useTranslations("OtpFormWrapper");
  const timeLimit = 60;
  let startTime = undefined;
  let number = undefined;
  let login = undefined;
  let confRes = undefined;
  if (type == 1) {
    startTime = useConfirmCode(state => state.startTime);
    number = useConfirmCode(state => state.number);
    login = useConfirmCode(state => state.login);
    confRes = useConfirmCode(state => state.confirmResult);
  } else if (type == 2) {
    startTime = useConfirmCodeRecovery(state => state.startTime);
    number = useConfirmCodeRecovery(state => state.number);
    confRes = useConfirmCodeRecovery(state => state.confirmResult);
  }
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (type == 1) {
      setIsLoaded(useConfirmCode.persist.hasHydrated());
    } else if (type == 2) {
      setIsLoaded(useConfirmCodeRecovery.persist.hasHydrated());
    }
  }, []);
  return isLoaded ? (
    startTime &&
    number &&
    (login || type == 2) &&
    confRes &&
    (new Date().getTime() - Number(startTime)) / 1000 <= timeLimit * 300 ? (
      <>
        {children}
        <OtpForm type={type} pushRoute={pushRoute}>
          <div className="flex flex-col gap-3 relative !mt-4">
            <Timer
              type={type}
              time={
                (new Date().getTime() - Number(startTime)) / 1000 <= timeLimit
                  ? timeLimit -
                    (new Date().getTime() - Number(startTime)) / 1000
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
              text={t("acceptButtonTitle")}
              className="btn btn-primary disabled:btn-disabled"
            />
          </div>
          <Link
            href={"/support/sms_code"}
            className="hover:underline cursor-pointer inline-block !mt-4 text-link-primary-color text-base font-light"
          >
            {t("didNotRecieveTitle")}
          </Link>
        </OtpForm>
      </>
    ) : (
      <RegError></RegError>
    )
  ) : (
    <Spinner className="flex mt-4" />
  );
}
