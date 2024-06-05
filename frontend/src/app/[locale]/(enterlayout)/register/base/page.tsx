import React from "react";
import RegDataForm from "@/components/reg-data-form/reg-data-form";
import Button from "@/components/ui/button/Button";
import { useTranslations } from "next-intl";

export default function page() {
  const t = useTranslations("RegisterBasePage");
  return (
    <div>
      <RegDataForm
        titles={
          <>
            <p className="text-text-primary-color h-20 font-light">
              {t("subTitle")}
            </p>
            <h2 className="text-text-primary-color h-14 text-xl">
              {t("title")}
            </h2>
          </>
        }
      >
        <Button
          type="submit"
          text={t("createAccountButtonTitle")}
          className="btn btn-primary"
        />
      </RegDataForm>
    </div>
  );
}
