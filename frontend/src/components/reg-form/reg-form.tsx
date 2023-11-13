"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import Button from "../ui/button/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { checkElement } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "../ui/input/Input";
import PhoneNumberInput from "../phone-number/phone-number";
import { isValidPhoneNumber } from "react-phone-number-input";
import { animate } from "framer-motion";
import { auth } from "@/config/firebase.config";
import { time } from "console";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
import DialogCaptchaSignup from "../dialog-captcha-signup/dialog-captcha-signup";
// import { isValidPhoneNumber } from "react-phone-number-input";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    recaptchaWidgetId?: number;
  }
}

function RegForm({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const formSchema = z.object({
    login: z
      .string()
      .min(5, { message: "Логин должен быть длинее 5 символов" }),
    number: z
      .string()
      // .optional()
      .refine(val => typeof val != "undefined" && isValidPhoneNumber(val), {
        message: "Введен некорректный номер, попробуйте исправить",
      }),
  });
  const setDefRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...

            onCheckNumber(form.getValues("number"));
            // router.push("/register");
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          },
        },
      );
    }
  };

  const changeCaptchaLoading = () => {};

  const onCheckNumber = (phoneNumber: string) => {
    setDefRecaptcha();
    if (window.recaptchaVerifier)
      signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
        .then(confirmationResult => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          window.recaptchaVerifier?.clear();
          window.recaptchaVerifier = undefined;
          router.push("/register");
          // ...
        })
        .catch(error => {
          // Error; SMS not sent
          // ...
          console.log(error);
        });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      number: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(isValidPhoneNumber(values.number));
    onOpen();
    await checkElement("#recaptcha-container");
    onCheckNumber(values.number);
    await checkElement("iframe[title=reCAPTCHA]");
    setCaptchaLoading(false);
    console.log(window.recaptchaVerifier);

    // 2. Define a submit handler.
    // function onSubmit(values: z.infer<typeof formSchema>) {
    //   // Do something with the form values.
    //   // ✅ This will be type-safe and validated.
    //   // console.log(isValidPhoneNumber(values.number));
    //   onOpen();
    //   onCheckNumber(form.getValues("number"));
    //   console.log(window.recaptchaVerifier);
  }
  return (
    <>
      <DialogCaptchaSignup
        setCaptchaLoading={setCaptchaLoading}
        captchaLoading={captchaLoading}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        isOpen={isOpen}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem className="space-y-1 my-1">
                <FormControl>
                  <Input
                    className="input input-secondary"
                    type="text"
                    placeholder="Login"
                    field={field}
                    required
                  ></Input>
                  {/* <PhoneNumberInput field={field} /> */}
                </FormControl>
                <FormMessage className=" text-white" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="space-y-1 my-1">
                <FormControl>
                  <PhoneNumberInput
                    className={"phone phone-secondary"}
                    field={field}
                  />
                  {/* <PhoneNumberInput field={field} /> */}
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          {children}
          <Button type="submit" text="Sign up" className="btn btn-secondary" />
        </form>
      </Form>
    </>
  );
}

export default RegForm;
