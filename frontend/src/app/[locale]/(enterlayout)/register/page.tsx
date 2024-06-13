import OtpFormWrapper from "@/components/otp-form-wrapper/otp-form-wrapper";
import { useTranslations } from "next-intl";
export default function Enter() {
  const t = useTranslations("RegisterPage");
  return (
    <>
      <OtpFormWrapper type={1} pushRoute="/register/base">
        <p className="text-text-primary-color h-8 font-light">
          {t("subTitle")}
        </p>
        <h2 className="text-text-primary-color h-14 text-xl">{t("title")}</h2>
      </OtpFormWrapper>
    </>
  );
}
