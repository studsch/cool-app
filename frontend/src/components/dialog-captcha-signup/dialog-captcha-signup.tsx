import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import type { SetStateAction } from "react";
import { useTranslations } from "next-intl";

interface IDialogCaptchaSignupProps {
  setCaptchaLoading: (value: SetStateAction<boolean>) => void;
  captchaLoading: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}

export default function DialogCaptchaSignup({
  setCaptchaLoading,
  captchaLoading,
  isOpen,
  onOpenChange,
  onOpen,
}: IDialogCaptchaSignupProps) {
  const t = useTranslations("CaptchaConfirmation");
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        setCaptchaLoading(true);
        window.recaptchaVerifier = undefined;
      }}
    >
      <ModalContent className="h-auto px-4 my-8">
        {onClose => (
          <div className="my-8">
            <ModalHeader className="primary text-lg ">{t("title")}</ModalHeader>
            <ModalBody className="flex flex-col justify-center gap-10  my-6">
              <p>{t("infoTitle")}</p>
              {captchaLoading && (
                <Spinner
                  className="absolute transform top-1/2 left-1/2 translate-x-[-50%] translate-y-[50%]"
                  color="default"
                />
              )}
              <div id="recaptcha-container" className="mx-auto my-2 h-20"></div>
            </ModalBody>
            <ModalFooter>
              <p className="text-md font-light">{t("footerTitle")}</p>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
