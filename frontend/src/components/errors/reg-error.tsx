"use client";

import { useConfirmCode } from "@/store";
import React from "react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Button from "../ui/button/Button";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useTranslations } from "next-intl";

export default function RegError() {
  useConfirmCode.persist.clearStorage();
  const t = useTranslations("RegError");
  signOut(auth);
  return (
    <div className="flex flex-col justify-center items-center">
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        size="4x"
        className="text-text-reg-primary-color w-full text-center mb-12 mt-2"
      />
      <h2 className="text-text-primary-color text-xl text-center mb-6">
        {t("title")}
      </h2>
      <div className="flex gap-4 justify-center items-center">
        <Link href="/">
          <Button
            type="button"
            text={t("toMainButtonTitle")}
            className="btn btn-primary"
          ></Button>
        </Link>
        <Link href="/enter">
          <Button
            type="button"
            text={t("toEnterButtonTitle")}
            className="btn btn-secondary"
          ></Button>
        </Link>
      </div>
      <p className="text-text-primary-color font-light text-center mt-14">
        {t("footerTitle")}
      </p>
      <Link href="/support" className="link mt-3 text-sm">
        {t("supportTitle")}
      </Link>
    </div>
  );
}
