"use client";
import React, { useEffect, useState } from "react";
import Timer from "../timer/timer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";
import OtpInput from "react18-input-otp";
import PhoneNumberInput from "../phone-number/phone-number";
import { type } from "os";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .optional(),
});

export default function OtpForm({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    router.push("/register/base");
  }
  const changeLogic = () => {
    const result = formSchema.safeParse({ code: form.getValues("code") });
    const button = document.querySelector("#accept");
    if (button) {
      if (!result.success) {
        // console.log("ERROR");
        button.setAttribute("disabled", "true");
      } else {
        // console.log("SUCcESS");
        button.removeAttribute("disabled");
      }
    }
  };
  console.log("dsds");
  const [completedTimer, setCompletedTimer] = useState(false);
  return (
    <div>
      <PhoneNumberInput
        className={"phone phone-secondary"}
        defaultValue={"+79994460356"}
        disabled
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-text-secondary-color pt-10 pb-4 flex items-center">
                  The code consists of 6 digits (XXXXXX)
                  <br />
                  Example: 123121
                </FormLabel>
                <FormControl>
                  <OtpInput
                    className="mb-0 sm:mt-10 mt-2"
                    onChange={(event: any[]) => {
                      console.log(event.toString());
                      field.onChange(event);
                      changeLogic();
                    }}
                    value={field.value}
                    ref={ref => {
                      console.log(ref?.getOtpValue());
                      if (field.value?.length) {
                        if (field.value.length == 6) field.onBlur();
                        else
                          field.ref({
                            focus: ref?.focusInput(field.value?.length),
                          });
                      }
                    }}
                    inputProps={{
                      type: "number",
                    }}
                    containerStyle="justify-center"
                    inputStyle="input input-primary min-w-[34px] mx-1 md:min-w-[40px]"
                    numInputs={6}
                    separator={
                      <span className="hidden lg:block text-text-secondary-color">
                        –
                      </span>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Timer
            time={2}
            className="mx-auto"
            completed={completedTimer}
            setCompletedTimer={setCompletedTimer}
          /> */}
          {/* <div className="flex flex-col gap-3 relative !mt-4">
            <Timer
              time={2}
              className="mx-auto"
              completed={completedTimer}
              setCompletedTimer={setCompletedTimer}
            />
            <Button
              disabled
              id="accept"
              type="submit"
              text="Accept"
              className="btn btn-primary disabled:btn-disabled"
            />
          </div> */}
          {children}
        </form>
      </Form>
    </div>
  );
}
