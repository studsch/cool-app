import LogFormPhone from "@/components/log-form/log-form-phone";
import { useTranslations } from "next-intl";

export default function Enter() {
  const t = useTranslations("EnterPhonePage");
  return (
    <>
      <div>
        <div className="w-full flex flex-col">
          <p className="h-5 md:h-6 sm:h-4 text-center text-sm font-light text-text-reg-secondary-color">
            {t("subTitle")}
          </p>
          <p className="h-12 md:h-16 sm:h-12 text-center text-2xl text-text-reg-secondary-color">
            {t("title")}
          </p>
          <LogFormPhone></LogFormPhone>
        </div>
      </div>
    </>
  );
}
