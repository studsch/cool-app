import OtpFormWrapper from "@/components/otp-form-wrapper/otp-form-wrapper";
import { useTranslations } from "next-intl";

export default function Number() {
  const t = useTranslations("EnterRecoveryNumberPage");
  return (
    <>
      <OtpFormWrapper type={2} pushRoute="repass">
        <p className="text-text-primary-color h-8 font-light">
          {t("subTitle")}
        </p>
        <h2 className="text-text-primary-color h-14 text-xl">{t("title")}</h2>
      </OtpFormWrapper>
    </>
  );
}
