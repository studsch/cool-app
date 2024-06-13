import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import PhoneNumberInput from "@/components/phone-number/phone-number";
import { Checkbox } from "@nextui-org/react";
import MemoriesSign from "@/components/memories-sign/memoriesSign";
import EnterToggleLink from "@/components/ui/links/enter-toggle-link";
import LogForm from "@/components/log-form/log-form";
import RegForm from "@/components/reg-form/reg-form";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Enter() {
  const t = useTranslations("EnterPage");
  return (
    <>
      <div className="w-full h-fit 2xl:w-[1000px]  2xl:h-[640px] md:h-[500px] sm:h-[460px] lg:w-[800px] m-auto flex relative z-10 shadow-3xl rounded-xl sm:rounded-md overflow-hidden">
        <div
          id="log-window"
          className="py-10 min-h-[400px] w-full px-unit-sm sm:px-unit-xl lg:px-unit-2xl h-full bg-white relative sm:flex flex flex-col justify-center items-center overflow-auto "
        >
          <h1 className="w-0 h-0 overflow-hidden">{t("title")}</h1>
          <MemoriesSign className="md:h-24 h-16" />
          <div className="w-full flex flex-col">
            <p className="h-5 md:h-6 sm:h-4 text-center text-sm font-light text-text-reg-secondary-color">
              {t("enterSubTitle")}
            </p>
            <p className="h-12 md:h-16 sm:h-12 text-center text-2xl text-text-reg-secondary-color">
              {t("enterTitle")}
            </p>
            <LogForm>
              <div className="mb-2 px-1 flex justify-between items-center md:h-auto sm:mb-1 sm:h-14 md:mb-2 md:mt-8 py-2">
                <Link
                  href="/enter/recovery"
                  className="hover:underline cursor-pointer text-link-primary-color text-sm font-light"
                >
                  {t("forgotPasswotdTitle")}
                </Link>
                <Link
                  href="/enter/phone"
                  className="text-end hover:underline cursor-pointer text-link-primary-color text-sm font-light"
                >
                  {t("signInWithPhoneTitle")}
                </Link>
              </div>
            </LogForm>
            <EnterToggleLink
              text={t("registerToggleTitle")}
              className="sm:hidden h-[6vh] sm:h-6 md:h-12 flex items-end md:items-center hover:underline cursor-pointer text-link-primary-color text-sm font-light"
            />
          </div>
        </div>
        <div
          id="reg-window"
          className="hidden py-10 px-unit-sm justify-center w-full sm:px-unit-xl lg:px-unit-2xl sm:flex flex-col  h-full bg-gradient-to-b from-text-reg-primary-color to-reg-gradient-down relative"
        >
          <h4 className="h-16 md:h-24 md:py-3 text-center font-extralight  text-text-reg-white-color">
            {t("registerSubTitle")}
          </h4>
          <div className="w-full flex flex-col">
            <hr className="mx-auto w-2/6 md:h-6 sm:h-4 h-5" />
            <h3
              id="create-acc-link"
              className="h-12 md:h-16 sm:h-12 text-center text-2xl text-text-reg-white-color"
            >
              {t("registerTitle")}
            </h3>
            <RegForm>
              <Checkbox
                classNames={{
                  base: "m-0 md:mb-2 md:mt-8 sm:h-14 sm:mb-1 md:h-auto px-1 mb-2 flex items-center",
                  wrapper: "checkbox-wrapper-secondary",
                  icon: "checkbox-icon-secondary",
                  label:
                    "text-text-reg-white-color text-sm font-light hover:text-place-holder-color my-auto",
                }}
                radius="none"
                size="sm"
              >
                {t("checkBoxTitle")}
              </Checkbox>
            </RegForm>
            <EnterToggleLink
              text={t("enterLoginPlaceholder")}
              className="sm:hidden h-[6vh] flex sm:h-6 md:h-12 items-end md:items-center hover:underline cursor-pointer text-text-reg-white-color  text-sm font-light"
            />
          </div>
        </div>
      </div>
    </>
  );
}
