"use client";
import React, { ReactNode, forwardRef, useEffect, useState } from "react";
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
import { render } from "react-dom";

const subButtonRef = forwardRef<HTMLButtonElement>(function subButtonRef(
  props,
  ref,
) {
  return (
    <Button type="submit" text="Accept" className="btn btn-primary" ref={ref} />
  );
});

const formSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Username must be at least 6 characters.",
    })
    .optional(),
});

export default function OtpForm({ children }: { children: React.ReactNode }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values");
  }

  // useEffect(() => {
  //   const result = formSchema.safeParse({ code: form.getValues("code") });
  //   if (subButtonRef.current != null) {
  //     if (!result.success) {
  //       console.log("ERROR");
  //       subButtonRef.current.disabled = true;
  //     } else {
  //       console.log("SUCcESS");
  //       subButtonRef.current.disabled = false;
  //     }
  //   }
  // }, [form.getValues("code")]);
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
                    className="mb-0 mt-10"
                    onChange={field.onChange}
                    value={field.value}
                    ref={ref => {
                      field.ref({
                        focus: ref?.focusInput,
                      });
                    }}
                    inputProps={{ type: "text" }}
                    containerStyle="justify-center"
                    inputStyle="input input-primary min-w-[34px] md:min-w-[40px] mx-1"
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
          <div className="flex justify-between  "> {children}</div>
          {subButtonRef}
          {/* <Button
            ref={subButtonRef}
            type="submit"
            text="Accept"
            className="btn btn-primary"
          /> */}
        </form>
      </Form>
    </div>
  );
}
