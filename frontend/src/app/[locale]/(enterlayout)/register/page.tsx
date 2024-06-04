import OtpFormWrapper from "@/components/otp-form-wrapper/otp-form-wrapper";

export default function Enter() {
  return (
    <>
      <OtpFormWrapper type={1} pushRoute="/register/base">
        <p className="text-text-primary-color h-8 font-light">
          Check your phone for SMS
        </p>
        <h2 className="text-text-primary-color h-14 text-xl">
          Phone notification
        </h2>
      </OtpFormWrapper>
    </>
  );
}
