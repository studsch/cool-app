"use client";
import React, { useState } from "react";
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
import OtpInput from "react-otp-input";
import PhoneNumberInput from "../phone-number/phone-number";

const formSchema = z.object({
  code: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function OtpForm({ children }: { children: React.ReactNode }) {
  const [otp, setOtp] = useState("");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

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
                <FormLabel>
                  The code consists of 6 digits (XXXXXX)
                  <br />
                  Example: 123121
                </FormLabel>
                <FormControl>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={props => <input {...props} />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between"> {children}</div>
          <Button type="submit" text="Accept" className="btn btn-primary" />
        </form>
      </Form>
    </div>
  );
}
