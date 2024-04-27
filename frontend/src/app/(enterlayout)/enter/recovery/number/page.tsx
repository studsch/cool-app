import OtpFormWrapper from "@/components/otp-form-wrapper/otp-form-wrapper";

export default function Number() {
  return (
    <>
      <OtpFormWrapper type={2} pushRoute="repass">
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
