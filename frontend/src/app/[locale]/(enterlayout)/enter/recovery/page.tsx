import PhoneForm from "@/components/phone-form/phone-form";
import { useTranslations } from "next-intl";

export default function Enter() {
  const t = useTranslations("EnterRecovery");
  return (
    <>
      <p className="text-text-primary-color h-12 font-light">{t("subTitle")}</p>
      <h2 className="text-text-primary-color h-14 text-xl">{t("title")}</h2>
      <PhoneForm>
        {" "}
        <div className="h-4"></div>
      </PhoneForm>
    </>
  );
}
